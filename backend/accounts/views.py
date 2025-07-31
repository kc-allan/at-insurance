from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .serializers import (
    LoginSerializer,
    SimpleRegistrationSerializer,
    UserProfileSerializer,
    UserRegistrationSerializer,
    TokenResponseSerializer
)
from .utils import normalize_phone_number

User = get_user_model()


@swagger_auto_schema(
    method='post',
    operation_description="Login with phone number and password",
    operation_summary="Login",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['phone_number', 'password'],
        properties={
            'phone_number': openapi.Schema(type=openapi.TYPE_STRING, description='Phone number in +254 format'),
            'password': openapi.Schema(type=openapi.TYPE_STRING, min_length=6),
        },
        example={
            "phone_number": "+254712345678",
            "password": "SecurePass123"
        }
    ),
    responses={
        200: openapi.Response(
            description="Login successful",
            examples={
                "application/json": {
                    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                    "user": {
                        "id": 1,
                        "phone_number": "+254712345678",
                        "first_name": "John",
                        "last_name": "Doe",
                        "is_verified": True
                    },
                    "message": "Login successful"
                }
            }
        ),
        400: "Bad request - Invalid phone number or password"
    },
    tags=['Authentication']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login with phone number and password.
    
    This endpoint allows farmers to login using their phone number and password.
    """
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Update last login
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        # Prepare response
        response_data = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserProfileSerializer(user).data,
            'message': 'Login successful'
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='post',
    operation_description="Register new farmer with phone number and password",
    operation_summary="Register",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['phone_number', 'first_name', 'last_name', 'password', 'password_confirm'],
        properties={
            'phone_number': openapi.Schema(type=openapi.TYPE_STRING, description='Phone number in +254 format'),
            'first_name': openapi.Schema(type=openapi.TYPE_STRING),
            'last_name': openapi.Schema(type=openapi.TYPE_STRING),
            'password': openapi.Schema(type=openapi.TYPE_STRING, min_length=6),
            'password_confirm': openapi.Schema(type=openapi.TYPE_STRING, min_length=6),
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='Optional email address'),
            'county': openapi.Schema(type=openapi.TYPE_STRING, description='Optional county'),
            'farming_type': openapi.Schema(type=openapi.TYPE_STRING, enum=['subsistence', 'commercial', 'mixed'], description='Optional farming type'),
            'farm_size_acres': openapi.Schema(type=openapi.TYPE_NUMBER, description='Optional farm size in acres'),
            'primary_crops': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING), description='Optional list of crops'),
        },
        example={
            "phone_number": "+254712345678",
            "first_name": "John",
            "last_name": "Doe",
            "password": "SecurePass123",
            "password_confirm": "SecurePass123"
        }
    ),
    responses={
        201: openapi.Response(
            description="Registration successful",
            examples={
                "application/json": {
                    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                    "user": {
                        "id": 1,
                        "phone_number": "+254712345678",
                        "first_name": "John",
                        "last_name": "Doe",
                        "is_verified": True
                    },
                    "message": "Registration successful"
                }
            }
        ),
        400: "Bad request - Invalid data, passwords don't match, or user already exists"
    },
    tags=['Authentication']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def simple_register(request):
    """
    Register new farmer with phone number and password.
    
    This endpoint allows farmers to register with basic information and a secure password.
    """
    serializer = SimpleRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        phone_number = serializer.validated_data['phone_number']
        password = serializer.validated_data['password']
        
        # Create new user
        user_data = {
            'phone_number': phone_number,
            'username': phone_number,
            'is_verified': True,
            'first_name': serializer.validated_data['first_name'],
            'last_name': serializer.validated_data['last_name'],
            'email': serializer.validated_data.get('email', ''),
            'county': serializer.validated_data.get('county', ''),
            'sub_county': serializer.validated_data.get('sub_county', ''),
            'farming_type': serializer.validated_data.get('farming_type', ''),
            'farm_size_acres': serializer.validated_data.get('farm_size_acres'),
            'primary_crops': serializer.validated_data.get('primary_crops', []),
        }
        
        with transaction.atomic():
            user = User.objects.create(**user_data)
            user.set_password(password)  # Hash the password
            user.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        # Prepare response
        response_data = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserProfileSerializer(user).data,
            'message': 'Registration successful'
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    """
    Get current user profile
    """
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update user profile
    """
    serializer = UserProfileSerializer(
        request.user,
        data=request.data,
        partial=request.method == 'PATCH'
    )
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Logout user by blacklisting the refresh token
    """
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
        return Response({'error': 'Refresh token required'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    """
    Refresh access token using refresh token
    """
    try:
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return Response({'error': 'Refresh token required'}, status=status.HTTP_400_BAD_REQUEST)
        
        token = RefreshToken(refresh_token)
        
        return Response({
            'access': str(token.access_token),
            'refresh': str(token)
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
