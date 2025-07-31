from rest_framework import viewsets, permissions
from .models import (
    Farmer, InsuranceProduct, Policy, Payment, 
    Claim, OTPLog, AuditLog
)
from .serializers import (
    FarmerSerializer, InsuranceProductSerializer, PolicySerializer,
    PaymentSerializer, ClaimSerializer, OTPLogSerializer, AuditLogSerializer
)

class FarmerViewSet(viewsets.ModelViewSet):
    queryset = Farmer.objects.all()
    serializer_class = FarmerSerializer
    permission_classes = [permissions.IsAuthenticated]


class InsuranceProductViewSet(viewsets.ModelViewSet):
    queryset = InsuranceProduct.objects.all()
    serializer_class = InsuranceProductSerializer
    permission_classes = [permissions.IsAuthenticated]


class PolicyViewSet(viewsets.ModelViewSet):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Policy.objects.all()
        farmer_id = self.request.query_params.get('farmer', None)
        if farmer_id:
            queryset = queryset.filter(farmer_id=farmer_id)
        return queryset


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Payment.objects.all()
        policy_id = self.request.query_params.get('policy', None)
        if policy_id:
            queryset = queryset.filter(policy_id=policy_id)
        return queryset


class ClaimViewSet(viewsets.ModelViewSet):
    queryset = Claim.objects.all()
    serializer_class = ClaimSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Claim.objects.all()
        policy_id = self.request.query_params.get('policy', None)
        if policy_id:
            queryset = queryset.filter(policy_id=policy_id)
        return queryset


class OTPLogViewSet(viewsets.ModelViewSet):
    queryset = OTPLog.objects.all()
    serializer_class = OTPLogSerializer
    permission_classes = [permissions.IsAuthenticated]


class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]
