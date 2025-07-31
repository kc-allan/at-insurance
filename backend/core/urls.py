from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PolicyViewSet, mpesa_stk_push

router = DefaultRouter()
router.register(r'policies', PolicyViewSet, basename='policy')

urlpatterns = [
    path('mpesa/stkpush/', mpesa_stk_push, name='mpesa_stk_push'),
    path('', include(router.urls)),
]
