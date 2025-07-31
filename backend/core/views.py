from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q
from datetime import datetime
from decimal import Decimal
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import Policy, Subscription, Claim, Payment, Document
from .serializers import (
    PolicySerializer, PolicyListSerializer, SubscriptionCreateSerializer,
    SubscriptionSerializer, ClaimCreateSerializer, ClaimSerializer,
    PaymentSerializer, PaymentInitiateSerializer, DocumentSerializer,
    PremiumCalculationSerializer
)
from .permissions import (
    IsSubscriptionOwner, IsClaimOwner, IsPaymentOwner, IsDocumentOwner,
    IsVerifiedUser, CanFileClaimPermission, CanSubscribeToPolicyPermission
)


class PolicyViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for policies - read-only for farmers"""
    queryset = Policy.objects.filter(is_active=True).order_by('policy_type', 'name')
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['policy_type', 'is_active']
    search_fields = ['name', 'description', 'coverage']
    ordering_fields = ['name', 'base_premium', 'created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PolicyListSerializer
        return PolicySerializer


class SubscriptionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing subscriptions"""
    permission_classes = [IsAuthenticated, CanSubscribeToPolicyPermission]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'is_paid', 'policy__policy_type']
    search_fields = ['subscription_number', 'policy__name']
    ordering_fields = ['subscribed_at', 'start_date', 'end_date']
    
    def get_queryset(self):
        # Handle schema generation for Swagger
        if getattr(self, 'swagger_fake_view', False):
            return Subscription.objects.none()
        return Subscription.objects.filter(user=self.request.user).select_related('policy')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return SubscriptionCreateSerializer
        return SubscriptionSerializer
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get user's active subscriptions"""
        active_subscriptions = self.get_queryset().filter(
            status='active',
            is_paid=True,
            start_date__lte=datetime.now().date(),
            end_date__gte=datetime.now().date()
        )
        serializer = self.get_serializer(active_subscriptions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a subscription"""
        subscription = self.get_object()
        if subscription.status == 'active':
            subscription.status = 'cancelled'
            subscription.save()
            return Response({'message': 'Subscription cancelled successfully'})
        return Response(
            {'error': 'Can only cancel active subscriptions'},
            status=status.HTTP_400_BAD_REQUEST
        )


class ClaimViewSet(viewsets.ModelViewSet):
    """ViewSet for managing claims"""
    permission_classes = [IsAuthenticated, CanFileClaimPermission]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'claim_type', 'subscription__policy__policy_type']
    search_fields = ['claim_number', 'description']
    ordering_fields = ['submitted_at', 'updated_at', 'loss_amount']
    
    def get_queryset(self):
        # Handle schema generation for Swagger
        if getattr(self, 'swagger_fake_view', False):
            return Claim.objects.none()
        return Claim.objects.filter(user=self.request.user).select_related(
            'subscription', 'subscription__policy'
        )
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ClaimCreateSerializer
        return ClaimSerializer
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get user's pending claims"""
        pending_claims = self.get_queryset().filter(
            status__in=['submitted', 'under_review', 'site_inspection']
        )
        serializer = self.get_serializer(pending_claims, many=True)
        return Response(serializer.data)


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing payment history"""
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['payment_type', 'payment_method', 'status']
    search_fields = ['transaction_id', 'gateway_ref']
    ordering_fields = ['initiated_at', 'completed_at', 'amount']
    
    def get_queryset(self):
        # Handle schema generation for Swagger
        if getattr(self, 'swagger_fake_view', False):
            return Payment.objects.none()
        return Payment.objects.filter(user=self.request.user).select_related(
            'subscription', 'claim'
        )


class DocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for document management"""
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['document_type']
    search_fields = ['description']
    
    def get_queryset(self):
        # Handle schema generation for Swagger
        if getattr(self, 'swagger_fake_view', False):
            return Document.objects.none()
        return Document.objects.filter(user=self.request.user)


@swagger_auto_schema(
    method='post',
    operation_description="Calculate premium amount for a policy and sum insured",
    operation_summary="Calculate Premium",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['policy_id', 'sum_insured'],
        properties={
            'policy_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the policy to calculate premium for'),
            'sum_insured': openapi.Schema(type=openapi.TYPE_NUMBER, description='Sum insured amount'),
        },
        example={
            "policy_id": 1,
            "sum_insured": 50000.00
        }
    ),
    responses={
        200: openapi.Response(
            description="Premium calculated successfully",
            examples={
                "application/json": {
                    "policy_id": 1,
                    "policy_name": "Crop Insurance - Maize",
                    "sum_insured": 50000.00,
                    "base_premium": 1000.00,
                    "premium_rate": 5.0,
                    "calculated_premium": 3500.00,
                    "total_cost": 3500.00,
                    "duration_months": 12
                }
            }
        ),
        400: "Bad request - Invalid policy or sum insured",
        401: "Unauthorized - Authentication required",
        403: "Forbidden - User not verified"
    },
    tags=['Utilities']
)
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsVerifiedUser])
def calculate_premium(request):
    """
    Calculate premium amount for a policy and sum insured.
    
    This endpoint calculates the total premium cost based on the policy's
    base premium and premium rate applied to the sum insured amount.
    """
    serializer = PremiumCalculationSerializer(data=request.data)
    if serializer.is_valid():
        policy = Policy.objects.get(id=serializer.validated_data['policy_id'])
        sum_insured = serializer.validated_data['sum_insured']
        
        premium_amount = policy.base_premium + (sum_insured * policy.premium_rate / 100)
        
        return Response({
            'policy_id': policy.id,
            'policy_name': policy.name,
            'sum_insured': sum_insured,
            'base_premium': policy.base_premium,
            'premium_rate': policy.premium_rate,
            'calculated_premium': premium_amount,
            'total_cost': premium_amount,
            'duration_months': policy.duration_months
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='post',
    operation_description="Initiate payment for a subscription premium",
    operation_summary="Initiate Payment",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['subscription_id', 'payment_method'],
        properties={
            'subscription_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the subscription to pay for'),
            'payment_method': openapi.Schema(type=openapi.TYPE_STRING, enum=['mpesa', 'bank', 'cash'], description='Payment method'),
            'phone_number': openapi.Schema(type=openapi.TYPE_STRING, description='Optional phone number (defaults to user phone)'),
        },
        example={
            "subscription_id": 1,
            "payment_method": "mpesa"
        }
    ),
    responses={
        200: openapi.Response(
            description="Payment initiated successfully",
            examples={
                "application/json": {
                    "transaction_id": "PAY_123456789",
                    "amount": 3500.00,
                    "payment_method": "mpesa",
                    "phone_number": "+254712345678",
                    "status": "pending",
                    "message": "Payment initiated successfully. Please complete payment via your preferred method."
                }
            }
        ),
        400: "Bad request - Invalid subscription or payment method",
        401: "Unauthorized - Authentication required"
    },
    tags=['Payments']
)
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsVerifiedUser])
def initiate_payment(request):
    """Initiate payment for a subscription"""
    serializer = PaymentInitiateSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        subscription = Subscription.objects.get(id=serializer.validated_data['subscription_id'])
        payment_method = serializer.validated_data['payment_method']
        phone_number = serializer.validated_data.get('phone_number', request.user.phone_number)
        
        # Create payment record
        payment = Payment.objects.create(
            user=request.user,
            subscription=subscription,
            payment_type='premium',
            amount=subscription.premium_amount,
            payment_method=payment_method,
            phone_number=phone_number,
            status='pending'
        )
        
        # Here you would integrate with actual payment gateway
        # For now, return the payment details
        return Response({
            'transaction_id': payment.transaction_id,
            'amount': payment.amount,
            'payment_method': payment.payment_method,
            'phone_number': payment.phone_number,
            'status': payment.status,
            'message': 'Payment initiated successfully. Please complete payment via your preferred method.'
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics for farmer"""
    user = request.user
    
    # Get subscription stats
    total_subscriptions = Subscription.objects.filter(user=user).count()
    active_subscriptions = Subscription.objects.filter(
        user=user,
        status='active',
        is_paid=True,
        start_date__lte=datetime.now().date(),
        end_date__gte=datetime.now().date()
    ).count()
    
    # Get claim stats
    total_claims = Claim.objects.filter(user=user).count()
    pending_claims = Claim.objects.filter(
        user=user,
        status__in=['submitted', 'under_review', 'site_inspection']
    ).count()
    approved_claims = Claim.objects.filter(user=user, status='approved').count()
    
    # Get payment stats
    total_premiums_paid = Payment.objects.filter(
        user=user,
        payment_type='premium',
        status='completed'
    ).aggregate(total=models.Sum('amount'))['total'] or 0
    
    claims_received = Payment.objects.filter(
        user=user,
        payment_type='claim',
        status='completed'
    ).aggregate(total=models.Sum('amount'))['total'] or 0
    
    return Response({
        'subscriptions': {
            'total': total_subscriptions,
            'active': active_subscriptions,
        },
        'claims': {
            'total': total_claims,
            'pending': pending_claims,
            'approved': approved_claims,
        },
        'financials': {
            'total_premiums_paid': total_premiums_paid,
            'claims_received': claims_received,
        }
    })


# Add missing import
from django.db import models
