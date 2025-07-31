from django.db import models
from django.utils import timezone

class PhoneOTP(models.Model):
    phone_number = models.CharField(max_length=15, unique=True)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(default=timezone.now)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.phone_number} - {self.otp}"
from django.db import models

from django.contrib.auth import get_user_model

User = get_user_model()

class Policy(models.Model):
    POLICY_TYPES = [
        ('crop', 'Crop'),
        ('livestock', 'Livestock'),
        ('flood', 'Flood'),
        ('fire', 'Fire'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=100)
    policy_type = models.CharField(max_length=20, choices=POLICY_TYPES)
    premium = models.DecimalField(max_digits=10, decimal_places=2)  # KSh 99999999.99
    coverage = models.TextField(help_text="Describe what the policy covers")
    duration_months = models.PositiveIntegerField(default=12)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.get_policy_type_display()})"

class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    policy = models.ForeignKey(Policy, on_delete=models.CASCADE, related_name='subscriptions')
    subscribed_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username} - {self.policy.name}"