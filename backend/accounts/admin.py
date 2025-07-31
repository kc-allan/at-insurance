from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, FarmPhoto


class FarmPhotoInline(admin.TabularInline):
    model = FarmPhoto
    extra = 0
    fields = ['photo', 'photo_type', 'description']


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['phone_number', 'first_name', 'last_name', 'county', 'is_verified', 'is_active']
    list_filter = ['is_verified', 'is_active', 'county', 'farming_type', 'registration_channel']
    search_fields = ['phone_number', 'first_name', 'last_name', 'national_id', 'county']
    ordering = ['-date_joined']
    
    inlines = [FarmPhotoInline]
    
    fieldsets = UserAdmin.fieldsets + (
        ('Contact Information', {
            'fields': ('phone_number', 'alternative_phone', 'national_id')
        }),
        ('Location', {
            'fields': ('county', 'sub_county', 'ward', 'village', 'gps_coordinates', 'nearest_town')
        }),
        ('Farm Details', {
            'fields': ('farm_size_acres', 'land_ownership_type', 'farming_type', 'primary_crops', 
                      'livestock_count', 'years_farming_experience', 'irrigation_type')
        }),
        ('Financial Information', {
            'fields': ('preferred_payment_method', 'mpesa_number', 'bank_account', 'bank_name', 
                      'average_annual_income')
        }),
        ('Risk Assessment', {
            'fields': ('previous_losses', 'has_insurance_history', 'education_level', 
                      'farmer_group_membership', 'has_received_farming_training')
        }),
        ('Emergency Contact', {
            'fields': ('next_of_kin_name', 'next_of_kin_phone')
        }),
        ('System', {
            'fields': ('is_verified', 'registration_channel', 'preferred_language', 'photo', 
                      'agent_code', 'referral_code')
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('phone_number', 'email', 'first_name', 'last_name', 'password1', 'password2'),
        }),
    )



@admin.register(FarmPhoto)
class FarmPhotoAdmin(admin.ModelAdmin):
    list_display = ['farmer', 'photo_type', 'description', 'uploaded_at']
    list_filter = ['photo_type', 'uploaded_at']
    search_fields = ['farmer__first_name', 'farmer__last_name', 'description']
    readonly_fields = ['uploaded_at']
