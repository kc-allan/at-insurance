from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object.
        return obj.user == request.user


class IsSubscriptionOwner(permissions.BasePermission):
    """
    Permission to check if user owns the subscription
    """
    
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsClaimOwner(permissions.BasePermission):
    """
    Permission to check if user owns the claim
    """
    
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsPaymentOwner(permissions.BasePermission):
    """
    Permission to check if user owns the payment record
    """
    
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsDocumentOwner(permissions.BasePermission):
    """
    Permission to check if user owns the document
    """
    
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsVerifiedUser(permissions.BasePermission):
    """
    Permission to check if user's phone number is verified
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.is_verified
        )


class CanFileClaimPermission(permissions.BasePermission):
    """
    Permission to check if user can file a claim for a subscription
    """
    
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        
        # For create action, check if user has active subscriptions
        if view.action == 'create':
            from .models import Subscription
            has_active_subscriptions = Subscription.objects.filter(
                user=request.user,
                status='active',
                is_paid=True
            ).exists()
            return has_active_subscriptions
        
        return True


class CanSubscribeToPolicyPermission(permissions.BasePermission):
    """
    Permission to check if user can subscribe to policies
    """
    
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        
        # Check if user's profile is sufficiently complete
        user = request.user
        required_fields = ['first_name', 'last_name', 'county']
        
        for field in required_fields:
            if not getattr(user, field):
                return False
        
        return user.is_verified


class IsStaffOrOwner(permissions.BasePermission):
    """
    Permission to allow staff members to access all objects,
    but regular users can only access their own objects
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Staff can access everything
        if request.user.is_staff:
            return True
        
        # Regular users can only access their own objects
        return obj.user == request.user


class ReadOnlyForFarmers(permissions.BasePermission):
    """
    Permission to allow farmers read-only access, staff can modify
    """
    
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        
        # Staff can do anything
        if request.user.is_staff:
            return True
        
        # Farmers can only read
        return request.method in permissions.SAFE_METHODS