from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Policy, Subscription, Claim, Payment, Document

User = get_user_model()


class PolicySerializer(serializers.ModelSerializer):
    """Serializer for Policy model"""
    
    class Meta:
        model = Policy
        fields = [
            'id', 'name', 'policy_type', 'description', 'coverage', 'exclusions',
            'base_premium', 'premium_rate', 'min_sum_insured', 'max_sum_insured',
            'duration_months', 'waiting_period_days', 'required_documents',
            'eligibility_criteria', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PolicyListSerializer(serializers.ModelSerializer):
    """Simplified serializer for policy listings"""
    
    class Meta:
        model = Policy
        fields = [
            'id', 'name', 'policy_type', 'description', 'base_premium',
            'premium_rate', 'min_sum_insured', 'max_sum_insured',
            'duration_months', 'is_active'
        ]


class SubscriptionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating subscriptions"""
    
    class Meta:
        model = Subscription
        fields = [
            'policy', 'sum_insured', 'insured_area_acres', 'insured_crop',
            'insured_livestock_count', 'asset_details', 'start_date', 'end_date'
        ]
        
    def validate(self, attrs):
        policy = attrs['policy']
        sum_insured = attrs['sum_insured']
        
        # Validate sum insured is within policy limits
        if sum_insured < policy.min_sum_insured:
            raise serializers.ValidationError(
                f"Sum insured must be at least KSh {policy.min_sum_insured}"
            )
        if sum_insured > policy.max_sum_insured:
            raise serializers.ValidationError(
                f"Sum insured cannot exceed KSh {policy.max_sum_insured}"
            )
        
        return attrs
    
    def create(self, validated_data):
        # Calculate premium amount
        policy = validated_data['policy']
        sum_insured = validated_data['sum_insured']
        
        premium_amount = policy.base_premium + (sum_insured * policy.premium_rate / 100)
        validated_data['premium_amount'] = premium_amount
        validated_data['user'] = self.context['request'].user
        
        return super().create(validated_data)


class SubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for subscription details"""
    policy = PolicyListSerializer(read_only=True)
    user_phone = serializers.CharField(source='user.phone_number', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    is_active_status = serializers.BooleanField(source='is_active', read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Subscription
        fields = [
            'id', 'subscription_number', 'policy', 'user_phone', 'user_name',
            'sum_insured', 'premium_amount', 'insured_area_acres', 'insured_crop',
            'insured_livestock_count', 'asset_details', 'start_date', 'end_date',
            'subscribed_at', 'status', 'is_paid', 'paid_at', 'is_active_status',
            'days_remaining'
        ]
        read_only_fields = [
            'id', 'subscription_number', 'subscribed_at', 'is_paid', 'paid_at'
        ]


class ClaimCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating claims"""
    
    class Meta:
        model = Claim
        fields = [
            'subscription', 'claim_type', 'incident_date', 'description', 'loss_amount'
        ]
        
    def validate_subscription(self, value):
        # Ensure user can only file claims for their own subscriptions
        user = self.context['request'].user
        if value.user != user:
            raise serializers.ValidationError("You can only file claims for your own subscriptions.")
        
        # Check if subscription is active
        if not value.is_active:
            raise serializers.ValidationError("Cannot file claim for inactive subscription.")
        
        return value
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ClaimSerializer(serializers.ModelSerializer):
    """Serializer for claim details"""
    subscription_number = serializers.CharField(source='subscription.subscription_number', read_only=True)
    policy_name = serializers.CharField(source='subscription.policy.name', read_only=True)
    user_phone = serializers.CharField(source='user.phone_number', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = Claim
        fields = [
            'id', 'claim_number', 'subscription_number', 'policy_name',
            'user_phone', 'user_name', 'claim_type', 'incident_date',
            'description', 'loss_amount', 'assessed_amount', 'approved_amount',
            'assessment_notes', 'status', 'submitted_at', 'updated_at',
            'rejection_reason'
        ]
        read_only_fields = [
            'id', 'claim_number', 'assessed_amount', 'approved_amount',
            'assessment_notes', 'submitted_at', 'updated_at', 'rejection_reason'
        ]


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for payment records"""
    user_phone = serializers.CharField(source='user.phone_number', read_only=True)
    subscription_number = serializers.CharField(source='subscription.subscription_number', read_only=True)
    claim_number = serializers.CharField(source='claim.claim_number', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'transaction_id', 'user_phone', 'subscription_number',
            'claim_number', 'payment_type', 'amount', 'payment_method',
            'status', 'gateway_ref', 'phone_number', 'initiated_at',
            'completed_at', 'notes'
        ]
        read_only_fields = [
            'id', 'transaction_id', 'initiated_at', 'completed_at'
        ]


class PaymentInitiateSerializer(serializers.Serializer):
    """Serializer for initiating payments"""
    subscription_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(choices=Payment.PAYMENT_METHODS)
    phone_number = serializers.CharField(max_length=15, required=False)
    
    def validate_subscription_id(self, value):
        user = self.context['request'].user
        try:
            subscription = Subscription.objects.get(id=value, user=user)
        except Subscription.DoesNotExist:
            raise serializers.ValidationError("Subscription not found.")
        
        if subscription.is_paid:
            raise serializers.ValidationError("Subscription is already paid.")
        
        return value


class DocumentSerializer(serializers.ModelSerializer):
    """Serializer for document uploads"""
    
    class Meta:
        model = Document
        fields = [
            'id', 'document_type', 'file', 'description', 'uploaded_at'
        ]
        read_only_fields = ['id', 'uploaded_at']
        
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class PremiumCalculationSerializer(serializers.Serializer):
    """Serializer for premium calculation"""
    policy_id = serializers.IntegerField()
    sum_insured = serializers.DecimalField(max_digits=12, decimal_places=2)
    
    def validate_policy_id(self, value):
        try:
            policy = Policy.objects.get(id=value, is_active=True)
        except Policy.DoesNotExist:
            raise serializers.ValidationError("Policy not found or inactive.")
        return value
    
    def validate(self, attrs):
        policy = Policy.objects.get(id=attrs['policy_id'])
        sum_insured = attrs['sum_insured']
        
        if sum_insured < policy.min_sum_insured:
            raise serializers.ValidationError(
                f"Sum insured must be at least KSh {policy.min_sum_insured}"
            )
        if sum_insured > policy.max_sum_insured:
            raise serializers.ValidationError(
                f"Sum insured cannot exceed KSh {policy.max_sum_insured}"
            )
        
        return attrs