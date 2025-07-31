import random
from .models import PhoneOTP
from .africastalking_utils import send_otp_sms
# OTP request endpoint
from rest_framework.decorators import api_view

@api_view(['POST'])
def request_otp(request):
    phone_number = request.data.get('phone_number')
    if not phone_number:
        return Response({'error': 'Phone number required'}, status=400)
    otp = str(random.randint(100000, 999999))
    PhoneOTP.objects.update_or_create(phone_number=phone_number, defaults={'otp': otp, 'is_verified': False})
    send_otp_sms(phone_number, otp)
    return Response({'message': 'OTP sent'})

# OTP verification endpoint
@api_view(['POST'])
def verify_otp(request):
    phone_number = request.data.get('phone_number')
    otp = request.data.get('otp')
    try:
        record = PhoneOTP.objects.get(phone_number=phone_number, otp=otp)
        record.is_verified = True
        record.save()
        return Response({'message': 'OTP verified'})
    except PhoneOTP.DoesNotExist:
        return Response({'error': 'Invalid OTP'}, status=400)

from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Policy
from .serializers import PolicySerializer
from .mpesa import lipa_na_mpesa_online


class PolicyViewSet(viewsets.ModelViewSet):
    queryset = Policy.objects.all().order_by('-created_at')
    serializer_class = PolicySerializer
    permission_classes = [permissions.AllowAny]


# M-Pesa STK Push API endpoint
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def mpesa_stk_push(request):
    # For demo, get these from request.data or use defaults
    phone_number = request.data.get('phone_number', '254700000000')
    amount = request.data.get('amount', 1)
    account_reference = request.data.get('account_reference', 'Test')
    transaction_desc = request.data.get('transaction_desc', 'Payment')
    callback_url = request.data.get('callback_url', 'http://localhost:8000/api/core/mpesa/callback/')
    result = lipa_na_mpesa_online(phone_number, amount, account_reference, transaction_desc, callback_url)
    return Response(result, status=status.HTTP_200_OK)
