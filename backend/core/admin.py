from django.contrib import admin
from .models import Policy, Subscription, Claim, Payment, Document


class DocumentInline(admin.TabularInline):
    model = Document
    extra = 0
    fields = ['document_type', 'file', 'description']


class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0
    fields = ['payment_type', 'amount', 'payment_method', 'status']
    readonly_fields = ['transaction_id']


@admin.register(Policy)
class PolicyAdmin(admin.ModelAdmin):
    list_display = ['name', 'policy_type', 'base_premium', 'premium_rate', 'is_active', 'created_at']
    list_filter = ['policy_type', 'is_active', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'policy_type', 'description', 'is_active')
        }),
        ('Coverage Details', {
            'fields': ('coverage', 'exclusions', 'min_sum_insured', 'max_sum_insured')
        }),
        ('Premium & Terms', {
            'fields': ('base_premium', 'premium_rate', 'duration_months', 'waiting_period_days')
        }),
        ('Requirements', {
            'fields': ('required_documents', 'eligibility_criteria'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['subscription_number', 'user', 'policy', 'sum_insured', 'status', 'start_date', 'end_date']
    list_filter = ['status', 'policy__policy_type', 'is_paid', 'start_date']
    search_fields = ['subscription_number', 'user__phone_number', 'user__first_name', 'user__last_name']
    readonly_fields = ['subscription_number', 'subscribed_at']
    
    inlines = [PaymentInline, DocumentInline]
    
    fieldsets = (
        ('Subscription Details', {
            'fields': ('subscription_number', 'user', 'policy', 'status')
        }),
        ('Coverage', {
            'fields': ('sum_insured', 'premium_amount', 'start_date', 'end_date')
        }),
        ('Asset Details', {
            'fields': ('insured_area_acres', 'insured_crop', 'insured_livestock_count', 'asset_details'),
            'classes': ('collapse',)
        }),
        ('Payment Status', {
            'fields': ('is_paid', 'paid_at')
        }),
        ('Timestamps', {
            'fields': ('subscribed_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(Claim)
class ClaimAdmin(admin.ModelAdmin):
    list_display = ['claim_number', 'user', 'claim_type', 'loss_amount', 'approved_amount', 'status', 'submitted_at']
    list_filter = ['status', 'claim_type', 'submitted_at']
    search_fields = ['claim_number', 'user__phone_number', 'description']
    readonly_fields = ['claim_number', 'submitted_at', 'updated_at']
    
    inlines = [DocumentInline]
    
    fieldsets = (
        ('Claim Information', {
            'fields': ('claim_number', 'subscription', 'user', 'claim_type', 'status')
        }),
        ('Incident Details', {
            'fields': ('incident_date', 'description', 'loss_amount')
        }),
        ('Assessment', {
            'fields': ('assessed_amount', 'approved_amount', 'assessment_notes')
        }),
        ('Processing', {
            'fields': ('reviewed_by', 'reviewed_at', 'paid_at', 'rejection_reason'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('submitted_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'user', 'payment_type', 'amount', 'payment_method', 'status', 'initiated_at']
    list_filter = ['payment_type', 'payment_method', 'status', 'initiated_at']
    search_fields = ['transaction_id', 'user__phone_number', 'gateway_ref']
    readonly_fields = ['transaction_id', 'initiated_at']
    
    fieldsets = (
        ('Transaction Details', {
            'fields': ('transaction_id', 'user', 'payment_type', 'amount', 'status')
        }),
        ('Payment Method', {
            'fields': ('payment_method', 'phone_number', 'gateway_ref')
        }),
        ('Related Records', {
            'fields': ('subscription', 'claim')
        }),
        ('Additional Information', {
            'fields': ('notes', 'metadata'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('initiated_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['user', 'document_type', 'description', 'uploaded_at']
    list_filter = ['document_type', 'uploaded_at']
    search_fields = ['user__phone_number', 'description']
    readonly_fields = ['uploaded_at']


# Customize admin site
admin.site.site_header = "AT Insurance Admin"
admin.site.site_title = "AT Insurance"
admin.site.index_title = "Administration Portal"