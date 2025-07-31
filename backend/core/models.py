from django.db import models
from django.utils import timezone

class Farmer(models.Model):
    phone_number = models.CharField(max_length=15, unique=True)
    name = models.CharField(max_length=100)
    county = models.CharField(max_length=100)
    national_id = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.phone_number})"


class InsuranceProduct(models.Model):
    CROP = 'crop'
    LIVESTOCK = 'livestock'
    PRODUCT_TYPE_CHOICES = [
        (CROP, 'Crop'),
        (LIVESTOCK, 'Livestock'),
    ]

    name = models.CharField(max_length=50)  # e.g. Maize, Beans, Cattle
    type = models.CharField(max_length=10, choices=PRODUCT_TYPE_CHOICES)
    premium_rate = models.DecimalField(max_digits=10, decimal_places=2)  # e.g. 300 per acre

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"


class Policy(models.Model):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='policies')
    product = models.ForeignKey(InsuranceProduct, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(help_text="Acreage or number of animals")
    total_premium = models.DecimalField(max_digits=10, decimal_places=2)
    policy_number = models.CharField(max_length=20, unique=True)
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField()
    pdf_url = models.URLField(blank=True, null=True)  # For web users
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.policy_number} - {self.farmer.phone_number}"


class Payment(models.Model):
    policy = models.ForeignKey(Policy, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=50, unique=True)
    method = models.CharField(max_length=50)  # e.g. STK Push, Paybill
    status = models.CharField(max_length=20, default='Pending')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.transaction_id} - {self.status}"


class Claim(models.Model):
    policy = models.ForeignKey(Policy, on_delete=models.CASCADE)
    description = models.TextField()
    claim_date = models.DateField(default=timezone.now)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ], default='pending')
    supporting_document = models.FileField(upload_to='claims/', blank=True, null=True)

    def __str__(self):
        return f"Claim for {self.policy.policy_number} - {self.status}"


class OTPLog(models.Model):
    phone_number = models.CharField(max_length=15)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.phone_number} - {self.otp_code} - {'Used' if self.is_used else 'Unused'}"


class AuditLog(models.Model):
    phone_number = models.CharField(max_length=15)
    action = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"{self.phone_number} - {self.action}"