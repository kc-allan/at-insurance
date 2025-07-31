from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.utils import timezone


class User(AbstractUser):
    """Custom User model for farmers"""
    
    # Phone number as primary identifier
    phone_regex = RegexValidator(
        regex=r'^\+?254?\d{9,10}$',
        message="Phone number must be entered in the format: '+254712345678' or '0712345678'"
    )
    phone_number = models.CharField(
        validators=[phone_regex], 
        max_length=15, 
        unique=True,
        help_text="Primary phone number for login"
    )
    
    # Personal Information
    national_id = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True, null=True)
    
    # Location Details
    county = models.CharField(max_length=50, blank=True, null=True)
    sub_county = models.CharField(max_length=50, blank=True, null=True)
    ward = models.CharField(max_length=50, blank=True, null=True)
    village = models.CharField(max_length=100, blank=True, null=True)
    gps_coordinates = models.CharField(max_length=50, blank=True, null=True, help_text="Latitude,Longitude")
    nearest_town = models.CharField(max_length=100, blank=True, null=True)
    
    # Farm Information
    farm_size_acres = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    LAND_OWNERSHIP_CHOICES = [
        ('owned', 'Owned'),
        ('leased', 'Leased'),
        ('family', 'Family Land'),
        ('communal', 'Communal'),
    ]
    land_ownership_type = models.CharField(max_length=20, choices=LAND_OWNERSHIP_CHOICES, blank=True, null=True)
    FARMING_TYPE_CHOICES = [
        ('subsistence', 'Subsistence'),
        ('commercial', 'Commercial'),
        ('mixed', 'Mixed'),
    ]
    farming_type = models.CharField(max_length=20, choices=FARMING_TYPE_CHOICES, blank=True, null=True)
    primary_crops = models.JSONField(default=list, blank=True, help_text="List of primary crops")
    livestock_count = models.JSONField(default=dict, blank=True, help_text="Dictionary of livestock types and counts")
    years_farming_experience = models.PositiveIntegerField(blank=True, null=True)
    IRRIGATION_CHOICES = [
        ('rain_fed', 'Rain Fed'),
        ('irrigation', 'Irrigation'),
        ('greenhouse', 'Greenhouse'),
        ('mixed', 'Mixed'),
    ]
    irrigation_type = models.CharField(max_length=20, choices=IRRIGATION_CHOICES, blank=True, null=True)
    
    # Financial Information
    PAYMENT_METHOD_CHOICES = [
        ('mpesa', 'M-Pesa'),
        ('bank', 'Bank Transfer'),
        ('cash', 'Cash'),
    ]
    preferred_payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='mpesa')
    mpesa_number = models.CharField(validators=[phone_regex], max_length=15, blank=True, null=True)
    bank_account = models.CharField(max_length=50, blank=True, null=True)
    bank_name = models.CharField(max_length=100, blank=True, null=True)
    average_annual_income = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    
    # Risk Assessment Data
    previous_losses = models.JSONField(default=dict, blank=True, help_text="Historical loss data")
    has_insurance_history = models.BooleanField(default=False)
    EDUCATION_CHOICES = [
        ('none', 'None'),
        ('primary', 'Primary'),
        ('secondary', 'Secondary'),
        ('tertiary', 'Tertiary'),
        ('university', 'University'),
    ]
    education_level = models.CharField(max_length=20, choices=EDUCATION_CHOICES, blank=True, null=True)
    farmer_group_membership = models.CharField(max_length=200, blank=True, null=True, help_text="Cooperative/SACCO membership")
    has_received_farming_training = models.BooleanField(default=False)
    
    # Contact & Emergency
    alternative_phone = models.CharField(validators=[phone_regex], max_length=15, blank=True, null=True)
    next_of_kin_name = models.CharField(max_length=200, blank=True, null=True)
    next_of_kin_phone = models.CharField(validators=[phone_regex], max_length=15, blank=True, null=True)
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('sw', 'Kiswahili'),
        ('local', 'Local Language'),
    ]
    preferred_language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default='en')
    
    # System Fields
    is_verified = models.BooleanField(default=True, help_text="Account verification status")
    REGISTRATION_CHANNEL_CHOICES = [
        ('app', 'Mobile App'),
        ('web', 'Web'),
        ('ussd', 'USSD'),
        ('agent', 'Agent'),
    ]
    registration_channel = models.CharField(max_length=10, choices=REGISTRATION_CHANNEL_CHOICES, default='app')
    last_login_ip = models.GenericIPAddressField(blank=True, null=True)
    
    # Additional Fields
    photo = models.ImageField(upload_to='farmers/photos/', blank=True, null=True)
    agent_code = models.CharField(max_length=20, blank=True, null=True, help_text="If registered through an agent")
    referral_code = models.CharField(max_length=20, blank=True, null=True)
    
    # Make phone_number the username field
    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']
    
    class Meta:
        db_table = 'farmers'
        verbose_name = 'Farmer'
        verbose_name_plural = 'Farmers'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.phone_number}"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def location_string(self):
        """Returns formatted location string"""
        parts = []
        if self.village:
            parts.append(self.village)
        if self.ward:
            parts.append(self.ward)
        if self.sub_county:
            parts.append(self.sub_county)
        if self.county:
            parts.append(self.county)
        return ", ".join(parts)



class FarmPhoto(models.Model):
    """Model to store multiple farm photos per farmer"""
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='farm_photos')
    photo = models.ImageField(upload_to='farms/photos/')
    description = models.CharField(max_length=200, blank=True)
    photo_type = models.CharField(
        max_length=20,
        choices=[
            ('land', 'Land/Field'),
            ('crops', 'Crops'),
            ('livestock', 'Livestock'),
            ('equipment', 'Equipment'),
            ('storage', 'Storage Facility'),
            ('other', 'Other'),
        ],
        default='land'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'farm_photos'
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.farmer.full_name} - {self.photo_type} photo"