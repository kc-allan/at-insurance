from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FarmerViewSet, InsuranceProductViewSet, PolicyViewSet,
    PaymentViewSet, ClaimViewSet, OTPLogViewSet, AuditLogViewSet
)

router = DefaultRouter()
router.register(r'farmers', FarmerViewSet, basename='farmer')
router.register(r'insurance-products', InsuranceProductViewSet, basename='insurance-product')
router.register(r'policies', PolicyViewSet, basename='policy')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'claims', ClaimViewSet, basename='claim')
router.register(r'otp-logs', OTPLogViewSet, basename='otp-log')
router.register(r'audit-logs', AuditLogViewSet, basename='audit-log')

urlpatterns = [
    path('', include(router.urls)),
]
