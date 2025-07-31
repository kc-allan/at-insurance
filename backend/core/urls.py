from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PolicyViewSet, SubscriptionViewSet, ClaimViewSet, PaymentViewSet,
    DocumentViewSet, calculate_premium, initiate_payment, dashboard_stats
)

router = DefaultRouter()
router.register(r'policies', PolicyViewSet, basename='policy')
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')
router.register(r'claims', ClaimViewSet, basename='claim')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'documents', DocumentViewSet, basename='document')

urlpatterns = [
    path('', include(router.urls)),
    
    # Additional API endpoints
    path('calculate-premium/', calculate_premium, name='calculate-premium'),
    path('initiate-payment/', initiate_payment, name='initiate-payment'),
    path('dashboard/', dashboard_stats, name='dashboard-stats'),
]
