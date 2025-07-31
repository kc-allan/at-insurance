from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PolicyViewSet, mpesa_stk_push, request_otp, verify_otp

router = DefaultRouter()
router.register(r'policies', PolicyViewSet, basename='policy')

urlpatterns = [
    path('mpesa/stkpush/', mpesa_stk_push, name='mpesa_stk_push'),
    path('auth/request-otp/', request_otp, name='request_otp'),
    path('auth/verify-otp/', verify_otp, name='verify_otp'),
    path('', include(router.urls)),
]
