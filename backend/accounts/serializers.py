from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator

User = get_user_model()


class PhoneNumberSerializer(serializers.Serializer):
    """Serializer for validating phone numbers"""
    phone_regex = RegexValidator(
        regex=r'^\+?254?\d{9,10}$',
        message="Phone number must be entered in the format: '+254712345678' or '0712345678'"
    )
    phone_number = serializers.CharField(validators=[phone_regex])
    
    def validate_phone_number(self, value):
        """Normalize phone number to +254 format"""
        if value.startswith('0'):
            value = '+254' + value[1:]
        elif value.startswith('254'):
            value = '+' + value
        return value


class LoginSerializer(PhoneNumberSerializer):
    """Serializer for phone number and password login"""
    password = serializers.CharField(write_only=True, min_length=6)
    
    def validate(self, attrs):
        attrs = super().validate(attrs)
        phone_number = attrs['phone_number']
        password = attrs['password']
        
        # Check if user exists
        user = User.objects.filter(phone_number=phone_number).first()
        if not user:
            raise serializers.ValidationError("Invalid phone number or password.")
        
        # Check password
        if not user.check_password(password):
            raise serializers.ValidationError("Invalid phone number or password.")
        
        attrs['user'] = user
        return attrs


class SimpleRegistrationSerializer(PhoneNumberSerializer):
    """Serializer for simple registration"""
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, min_length=6)
    
    # Optional farm details
    county = serializers.CharField(max_length=50, required=False, allow_blank=True)
    sub_county = serializers.CharField(max_length=50, required=False, allow_blank=True)
    farming_type = serializers.ChoiceField(
        choices=[('subsistence', 'Subsistence'), ('commercial', 'Commercial'), ('mixed', 'Mixed')],
        required=False, allow_blank=True
    )
    farm_size_acres = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    primary_crops = serializers.ListField(
        child=serializers.CharField(max_length=50),
        required=False, allow_empty=True
    )
    
    def validate(self, attrs):
        attrs = super().validate(attrs)
        phone_number = attrs['phone_number']
        password = attrs['password']
        password_confirm = attrs['password_confirm']
        
        # Check if user exists
        if User.objects.filter(phone_number=phone_number).exists():
            raise serializers.ValidationError({"phone_number": "A user with this phone number already exists."})
        
        # Check password confirmation
        if password != password_confirm:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    full_name = serializers.ReadOnlyField()
    location_string = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = [
            'id', 'phone_number', 'email', 'first_name', 'last_name', 'full_name',
            'national_id', 'date_of_birth', 'gender',
            'county', 'sub_county', 'ward', 'village', 'location_string',
            'gps_coordinates', 'nearest_town',
            'farm_size_acres', 'land_ownership_type', 'farming_type',
            'primary_crops', 'livestock_count', 'years_farming_experience',
            'irrigation_type', 'preferred_payment_method', 'mpesa_number',
            'bank_account', 'bank_name', 'average_annual_income',
            'has_insurance_history', 'education_level', 'farmer_group_membership',
            'has_received_farming_training', 'alternative_phone',
            'next_of_kin_name', 'next_of_kin_phone', 'preferred_language',
            'is_verified', 'photo', 'date_joined'
        ]
        read_only_fields = ['id', 'phone_number', 'is_verified', 'date_joined']
        
    def validate_mpesa_number(self, value):
        """Validate and normalize M-Pesa number"""
        if value:
            phone_regex = RegexValidator(
                regex=r'^\+?254?\d{9,10}$',
                message="M-Pesa number must be a valid Kenyan phone number"
            )
            phone_regex(value)
            
            # Normalize to +254 format
            if value.startswith('0'):
                value = '+254' + value[1:]
            elif value.startswith('254'):
                value = '+' + value
        return value


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for detailed user registration"""
    class Meta:
        model = User
        fields = [
            'phone_number', 'email', 'first_name', 'last_name',
            'county', 'sub_county', 'ward', 'village',
            'farming_type', 'farm_size_acres', 'primary_crops',
            'livestock_count', 'years_farming_experience'
        ]
        
    def create(self, validated_data):
        validated_data['is_verified'] = True
        validated_data['username'] = validated_data['phone_number']
        
        user = User.objects.create(**validated_data)
        user.set_unusable_password()
        user.save()
        
        return user


class TokenResponseSerializer(serializers.Serializer):
    """Serializer for authentication response"""
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserProfileSerializer()
    message = serializers.CharField()