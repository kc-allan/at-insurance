from django.db import models
<<<<<<< HEAD
from django.utils import timezone

class PhoneOTP(models.Model):
    phone_number = models.CharField(max_length=15, unique=True)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(default=timezone.now)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.phone_number} - {self.otp}"
from django.db import models
=======
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
>>>>>>> f4bf55f5aca01e57823ed8cc01ecc0a29e45346c


class Policy(models.Model):
    POLICY_TYPES = [
        ('crop', 'Crop Insurance'),
        ('livestock', 'Livestock Insurance'),
        ('weather_index', 'Weather Index Insurance'),
        ('equipment', 'Farm Equipment Insurance'),
        ('greenhouse', 'Greenhouse Insurance'),
        ('poultry', 'Poultry Insurance'),
        ('aquaculture', 'Aquaculture Insurance'),
        ('storage', 'Post-Harvest Storage Insurance'),
    ]

    name = models.CharField(max_length=100)
    policy_type = models.CharField(max_length=20, choices=POLICY_TYPES)
    description = models.TextField(default="", help_text="Detailed description of the policy")
    coverage = models.TextField(help_text="What the policy covers")
    exclusions = models.TextField(help_text="What is not covered", blank=True)
    
    # Premium details
    base_premium = models.DecimalField(max_digits=10, decimal_places=2, default=1000, help_text="Base premium amount in KSh")
    premium_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5.0,
                                      validators=[MinValueValidator(0), MaxValueValidator(100)],
                                      help_text="Premium rate as percentage of sum insured")
    
    # Coverage limits
    min_sum_insured = models.DecimalField(max_digits=12, decimal_places=2, default=10000)
    max_sum_insured = models.DecimalField(max_digits=12, decimal_places=2, default=10000000)
    
    # Policy terms
    duration_months = models.PositiveIntegerField(default=12)
    waiting_period_days = models.PositiveIntegerField(default=14, help_text="Days before coverage starts")
    
    # Requirements
    required_documents = models.JSONField(default=list, help_text="List of required documents")
    eligibility_criteria = models.JSONField(default=dict, help_text="Eligibility requirements")
    
    # Status
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'policies'
        ordering = ['policy_type', 'name']
        verbose_name_plural = 'Policies'

    def __str__(self):
        return f"{self.name} ({self.get_policy_type_display()})"


class Subscription(models.Model):
    SUBSCRIPTION_STATUS = [
        ('pending', 'Pending Payment'),
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
        ('suspended', 'Suspended'),
    ]
    
    # Unique subscription number
    subscription_number = models.CharField(max_length=20, unique=True, editable=False)
    
    # Relationships
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscriptions')
    policy = models.ForeignKey(Policy, on_delete=models.CASCADE, related_name='subscriptions')
    
    # Coverage details
    sum_insured = models.DecimalField(max_digits=12, decimal_places=2)
    premium_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Farm/Asset details
    insured_area_acres = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    insured_crop = models.CharField(max_length=100, blank=True)
    insured_livestock_count = models.PositiveIntegerField(null=True, blank=True)
    asset_details = models.JSONField(default=dict, blank=True)
    
    # Dates
    start_date = models.DateField()
    end_date = models.DateField()
    subscribed_at = models.DateTimeField(auto_now_add=True)
    
    # Status
    status = models.CharField(max_length=20, choices=SUBSCRIPTION_STATUS, default='pending')
    
    # Payment tracking
    is_paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'subscriptions'
        ordering = ['-subscribed_at']
        
    def save(self, *args, **kwargs):
        if not self.subscription_number:
            # Generate unique subscription number
            prefix = 'SUB'
            timestamp = timezone.now().strftime('%Y%m%d')
            random_part = str(uuid.uuid4().hex)[:6].upper()
            self.subscription_number = f"{prefix}{timestamp}{random_part}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.subscription_number} - {self.user.phone_number} - {self.policy.name}"
    
    @property
    def is_active(self):
        """Check if subscription is currently active"""
        today = timezone.now().date()
        return (self.status == 'active' and 
                self.start_date <= today <= self.end_date and 
                self.is_paid)
    
    @property
    def days_remaining(self):
        """Calculate days remaining in subscription"""
        if self.is_active:
            return (self.end_date - timezone.now().date()).days
        return 0


class Claim(models.Model):
    CLAIM_STATUS = [
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('site_inspection', 'Site Inspection Scheduled'),
        ('processing', 'Processing'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('paid', 'Paid'),
        ('closed', 'Closed'),
    ]
    
    CLAIM_TYPES = [
        ('crop_loss', 'Crop Loss'),
        ('livestock_death', 'Livestock Death'),
        ('weather_damage', 'Weather Damage'),
        ('disease', 'Disease/Pest Damage'),
        ('theft', 'Theft'),
        ('fire', 'Fire Damage'),
        ('flood', 'Flood Damage'),
        ('equipment_damage', 'Equipment Damage'),
        ('other', 'Other'),
    ]
    
    # Unique claim number
    claim_number = models.CharField(max_length=20, unique=True, editable=False)
    
    # Relationships
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='claims')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='claims')
    
    # Claim details
    claim_type = models.CharField(max_length=20, choices=CLAIM_TYPES)
    incident_date = models.DateField()
    description = models.TextField()
    loss_amount = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Assessment
    assessed_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    approved_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    assessment_notes = models.TextField(blank=True)
    
    # Status tracking
    status = models.CharField(max_length=20, choices=CLAIM_STATUS, default='submitted')
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Processing details
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
                                   related_name='reviewed_claims')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    
    class Meta:
        db_table = 'claims'
        ordering = ['-submitted_at']
        
    def save(self, *args, **kwargs):
        if not self.claim_number:
            # Generate unique claim number
            prefix = 'CLM'
            timestamp = timezone.now().strftime('%Y%m%d')
            random_part = str(uuid.uuid4().hex)[:6].upper()
            self.claim_number = f"{prefix}{timestamp}{random_part}"
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"{self.claim_number} - {self.get_claim_type_display()} - {self.get_status_display()}"


class Payment(models.Model):
    PAYMENT_TYPES = [
        ('premium', 'Premium Payment'),
        ('claim', 'Claim Settlement'),
        ('refund', 'Refund'),
    ]
    
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    PAYMENT_METHODS = [
        ('mpesa', 'M-Pesa'),
        ('bank_transfer', 'Bank Transfer'),
        ('cash', 'Cash'),
        ('cheque', 'Cheque'),
    ]
    
    # Unique transaction ID
    transaction_id = models.CharField(max_length=50, unique=True, editable=False)
    
    # Relationships
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments')
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, null=True, blank=True,
                                   related_name='payments')
    claim = models.ForeignKey(Claim, on_delete=models.CASCADE, null=True, blank=True,
                            related_name='payments')
    
    # Payment details
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    
    # Status
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    
    # Payment gateway details
    gateway_ref = models.CharField(max_length=100, blank=True, help_text="Payment gateway reference")
    phone_number = models.CharField(max_length=15, blank=True, help_text="Phone number used for payment")
    
    # Timestamps
    initiated_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Additional info
    notes = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    class Meta:
        db_table = 'payments'
        ordering = ['-initiated_at']
        
    def save(self, *args, **kwargs):
        if not self.transaction_id:
            # Generate unique transaction ID
            prefix = 'TXN'
            timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
            random_part = str(uuid.uuid4().hex)[:6].upper()
            self.transaction_id = f"{prefix}{timestamp}{random_part}"
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"{self.transaction_id} - {self.get_payment_type_display()} - KSh {self.amount}"


class Document(models.Model):
    DOCUMENT_TYPES = [
        ('id_card', 'National ID Card'),
        ('farm_photo', 'Farm Photo'),
        ('ownership_doc', 'Land Ownership Document'),
        ('loss_evidence', 'Loss Evidence'),
        ('assessment_report', 'Assessment Report'),
        ('receipt', 'Receipt'),
        ('other', 'Other'),
    ]
    
    # Relationships
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents')
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, null=True, blank=True,
                                   related_name='documents')
    claim = models.ForeignKey(Claim, on_delete=models.CASCADE, null=True, blank=True,
                            related_name='documents')
    
    # Document details
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='documents/%Y/%m/%d/')
    description = models.CharField(max_length=255, blank=True)
    
    # Timestamps
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'documents'
        ordering = ['-uploaded_at']
        
    def __str__(self):
        return f"{self.get_document_type_display()} - {self.user.phone_number}"