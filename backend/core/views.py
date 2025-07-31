from rest_framework import viewsets, permissions
from .models import Policy
from .serializers import PolicySerializer
# Create your views here.


class PolicyViewSet(viewsets.ModelViewSet):
    queryset = Policy.objects.all().order_by('-created_at')
    serializer_class = PolicySerializer
    permission_classes = [permissions.AllowAny]
