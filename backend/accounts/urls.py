from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    # Authentication
    path('auth/login/', views.login, name='login'),
    path('auth/register/', views.simple_register, name='register'),
    path('auth/refresh/', views.refresh_token, name='refresh-token'),
    path('auth/logout/', views.logout, name='logout'),
    
    # Profile
    path('profile/', views.get_profile, name='get-profile'),
    path('profile/update/', views.update_profile, name='update-profile'),
]