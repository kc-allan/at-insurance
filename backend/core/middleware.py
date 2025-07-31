import logging
import time
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from django.core.cache import cache
from django.conf import settings
from rest_framework import status

logger = logging.getLogger(__name__)


class SecurityHeadersMiddleware(MiddlewareMixin):
    """
    Middleware to add security headers to all responses
    """
    
    def process_response(self, request, response):
        # Security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Only add HSTS in production with HTTPS
        if not settings.DEBUG and request.is_secure():
            response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        
        return response


class APIThrottlingMiddleware(MiddlewareMixin):
    """
    Simple API throttling middleware
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        self.rate_limit = getattr(settings, 'API_RATE_LIMIT', 100)  # requests per minute
        self.window_size = 60  # 1 minute window
        
    def __call__(self, request):
        # Skip throttling for staff users
        if hasattr(request, 'user') and request.user.is_authenticated and request.user.is_staff:
            return self.get_response(request)
        
        # Only throttle API requests
        if not request.path.startswith('/api/'):
            return self.get_response(request)
        
        # Get client IP
        client_ip = self.get_client_ip(request)
        cache_key = f"api_throttle:{client_ip}"
        
        # Get current request count
        current_requests = cache.get(cache_key, 0)
        
        if current_requests >= self.rate_limit:
            return JsonResponse(
                {
                    'error': 'Rate limit exceeded',
                    'detail': f'Maximum {self.rate_limit} requests per minute allowed'
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
        
        # Increment counter
        cache.set(cache_key, current_requests + 1, self.window_size)
        
        response = self.get_response(request)
        
        # Add rate limit headers
        response['X-RateLimit-Limit'] = str(self.rate_limit)
        response['X-RateLimit-Remaining'] = str(max(0, self.rate_limit - current_requests - 1))
        
        return response
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class RequestLoggingMiddleware(MiddlewareMixin):
    """
    Middleware to log API requests for security monitoring
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        # Record start time
        start_time = time.time()
        
        # Log request
        if request.path.startswith('/api/'):
            self.log_request(request)
        
        response = self.get_response(request)
        
        # Log response
        if request.path.startswith('/api/'):
            duration = time.time() - start_time
            self.log_response(request, response, duration)
        
        return response
    
    def log_request(self, request):
        logger.info(
            f"API Request: {request.method} {request.path} "
            f"from {self.get_client_ip(request)} "
            f"User: {getattr(request.user, 'phone_number', 'Anonymous') if hasattr(request, 'user') else 'Anonymous'}"
        )
    
    def log_response(self, request, response, duration):
        logger.info(
            f"API Response: {request.method} {request.path} "
            f"Status: {response.status_code} "
            f"Duration: {duration:.3f}s"
        )
        
        # Log failed authentication attempts
        if response.status_code == 401:
            logger.warning(
                f"Failed authentication attempt: {request.method} {request.path} "
                f"from {self.get_client_ip(request)}"
            )
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class OTPRateLimitMiddleware(MiddlewareMixin):
    """
    Special rate limiting for OTP endpoints to prevent abuse
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        self.otp_endpoints = ['/api/accounts/auth/send-otp/']
        self.rate_limit = 3  # 3 OTP requests per hour
        self.window_size = 3600  # 1 hour
        
    def __call__(self, request):
        # Check if this is an OTP endpoint
        if request.path in self.otp_endpoints and request.method == 'POST':
            # Get client IP
            client_ip = self.get_client_ip(request)
            cache_key = f"otp_throttle:{client_ip}"
            
            # Get current request count
            current_requests = cache.get(cache_key, 0)
            
            if current_requests >= self.rate_limit:
                return JsonResponse(
                    {
                        'error': 'OTP rate limit exceeded',
                        'detail': f'Maximum {self.rate_limit} OTP requests per hour allowed'
                    },
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )
            
            # Increment counter
            cache.set(cache_key, current_requests + 1, self.window_size)
        
        return self.get_response(request)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip