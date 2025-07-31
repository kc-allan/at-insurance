"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Swagger/OpenAPI Schema
schema_view = get_schema_view(
    openapi.Info(
        title="AT Insurance API",
        default_version='v1',
        description="""
# AT Insurance API Documentation

Welcome to the AT Insurance API! This comprehensive API provides all the tools needed to manage farmer insurance services in Kenya.

## Overview
The AT Insurance platform is designed specifically for farmers, offering:
- **OTP-based Authentication**: Secure phone number verification
- **Policy Management**: Browse and subscribe to insurance policies
- **Claims Processing**: File and track insurance claims
- **Payment Integration**: Handle premium payments and claim settlements
- **Document Management**: Upload and manage insurance documents

## Authentication
Most endpoints require authentication using JWT tokens. Follow these steps:

1. **Send OTP**: Use `/api/accounts/auth/send-otp/` to request an OTP
2. **Verify OTP**: Use `/api/accounts/auth/verify-otp/` to get your JWT tokens
3. **Use Token**: Include the access token in the Authorization header: `Bearer <your_token>`

## Getting Started
1. Register or login using your phone number
2. Complete your farmer profile
3. Browse available insurance policies
4. Subscribe to policies that suit your farming needs
5. File claims when needed

## Support
For technical support, please contact the development team.
        """,
        terms_of_service="https://www.atinsurance.com/terms/",
        contact=openapi.Contact(email="support@atinsurance.com"),
        license=openapi.License(name="Proprietary License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
    authentication_classes=[],
)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API Documentation
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('', schema_view.with_ui('swagger', cache_timeout=0), name='api-docs'),  # Root redirects to docs
    
    # API Endpoints
    path('api/accounts/', include('accounts.urls')),
    path('api/core/', include('core.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
