from django.urls import path
from .views import mpesa_stk_push

urlpatterns = [
    path('mpesa/stkpush/', mpesa_stk_push, name='mpesa_stk_push'),
]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PolicyViewSet

router = DefaultRouter()
router.register(r'policies', PolicyViewSet, basename='policy')

urlpatterns = [
    path('', include(router.urls)),
]
