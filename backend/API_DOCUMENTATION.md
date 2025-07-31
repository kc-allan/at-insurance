# AT Insurance API Documentation

## Overview
The AT Insurance API provides comprehensive endpoints for managing farmer insurance services including user authentication, policy management, subscriptions, claims, and payments.

## Base URL
```
http://localhost:8000/api/
```

## Authentication
The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### 1. Send OTP
**POST** `/accounts/auth/send-otp/`

Send OTP to a phone number for authentication.

**Request Body:**
```json
{
    "phone_number": "+254712345678",
    "registration": false
}
```

**Response:**
```json
{
    "message": "OTP sent successfully",
    "phone_number": "+254712345678",
    "expires_in_minutes": 5
}
```

### 2. Verify OTP & Login
**POST** `/accounts/auth/verify-otp/`

Verify OTP and get JWT tokens.

**Request Body:**
```json
{
    "phone_number": "+254712345678",
    "otp_code": "123456",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com"
}
```

**Response:**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 1,
        "phone_number": "+254712345678",
        "first_name": "John",
        "last_name": "Doe",
        "is_verified": true
    },
    "is_new_user": true
}
```

### 3. Refresh Token
**POST** `/accounts/auth/refresh/`

Refresh access token using refresh token.

### 4. Logout
**POST** `/accounts/auth/logout/`

Blacklist refresh token to logout.

### 5. Get Profile
**GET** `/accounts/profile/`

Get current user profile information.

### 6. Update Profile
**PUT/PATCH** `/accounts/profile/update/`

Update user profile information.

---

## Policy Endpoints

### 1. List Policies
**GET** `/core/policies/`

Get list of available insurance policies.

**Query Parameters:**
- `policy_type`: Filter by policy type (crop, livestock, etc.)
- `search`: Search in name, description, coverage
- `ordering`: Sort by name, base_premium, created_at

**Response:**
```json
{
    "count": 10,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "name": "Crop Insurance - Maize",
            "policy_type": "crop",
            "description": "Insurance coverage for maize crops",
            "base_premium": 1000.00,
            "premium_rate": 5.0,
            "min_sum_insured": 10000.00,
            "max_sum_insured": 1000000.00,
            "duration_months": 12,
            "is_active": true
        }
    ]
}
```

### 2. Get Policy Details
**GET** `/core/policies/{id}/`

Get detailed information about a specific policy.

---

## Subscription Endpoints

### 1. List My Subscriptions
**GET** `/core/subscriptions/`

Get user's subscriptions.

**Query Parameters:**
- `status`: Filter by status (pending, active, expired, etc.)
- `is_paid`: Filter by payment status
- `policy__policy_type`: Filter by policy type

### 2. Create Subscription
**POST** `/core/subscriptions/`

Subscribe to an insurance policy.

**Request Body:**
```json
{
    "policy": 1,
    "sum_insured": 50000.00,
    "insured_area_acres": 5.0,
    "insured_crop": "Maize",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31"
}
```

### 3. Get Active Subscriptions
**GET** `/core/subscriptions/active/`

Get user's currently active subscriptions.

### 4. Cancel Subscription
**POST** `/core/subscriptions/{id}/cancel/`

Cancel an active subscription.

---

## Claims Endpoints

### 1. List My Claims
**GET** `/core/claims/`

Get user's insurance claims.

**Query Parameters:**
- `status`: Filter by claim status
- `claim_type`: Filter by claim type
- `search`: Search in claim number, description

### 2. File New Claim
**POST** `/core/claims/`

File a new insurance claim.

**Request Body:**
```json
{
    "subscription": 1,
    "claim_type": "crop_loss",
    "incident_date": "2024-01-15",
    "description": "Crop destroyed by drought",
    "loss_amount": 25000.00
}
```

### 3. Get Pending Claims
**GET** `/core/claims/pending/`

Get user's pending claims.

---

## Payment Endpoints

### 1. Payment History
**GET** `/core/payments/`

Get user's payment history.

**Query Parameters:**
- `payment_type`: Filter by payment type (premium, claim, refund)
- `payment_method`: Filter by payment method
- `status`: Filter by payment status

### 2. Initiate Payment
**POST** `/core/initiate-payment/`

Initiate payment for a subscription.

**Request Body:**
```json
{
    "subscription_id": 1,
    "payment_method": "mpesa",
    "phone_number": "+254712345678"
}
```

---

## Utility Endpoints

### 1. Calculate Premium
**POST** `/core/calculate-premium/`

Calculate premium for a policy and sum insured.

**Request Body:**
```json
{
    "policy_id": 1,
    "sum_insured": 50000.00
}
```

**Response:**
```json
{
    "policy_id": 1,
    "policy_name": "Crop Insurance - Maize",
    "sum_insured": 50000.00,
    "base_premium": 1000.00,
    "premium_rate": 5.0,
    "calculated_premium": 3500.00,
    "total_cost": 3500.00,
    "duration_months": 12
}
```

### 2. Dashboard Stats
**GET** `/core/dashboard/`

Get dashboard statistics for the farmer.

**Response:**
```json
{
    "subscriptions": {
        "total": 5,
        "active": 2
    },
    "claims": {
        "total": 3,
        "pending": 1,
        "approved": 2
    },
    "financials": {
        "total_premiums_paid": 15000.00,
        "claims_received": 25000.00
    }
}
```

---

## Document Endpoints

### 1. Upload Document
**POST** `/core/documents/`

Upload a document (multipart/form-data).

**Form Data:**
- `document_type`: Type of document
- `file`: File to upload
- `description`: Optional description

### 2. List Documents
**GET** `/core/documents/`

Get user's uploaded documents.

---

## Error Responses

### Common Error Codes
- `400`: Bad Request - Invalid data
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Permission denied
- `404`: Not Found - Resource not found
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error

### Error Response Format
```json
{
    "error": "Error message",
    "detail": "Detailed error description",
    "field_errors": {
        "field_name": ["Field-specific error message"]
    }
}
```

---

## Rate Limiting

- **General API**: 100 requests per minute per IP
- **OTP Endpoints**: 3 requests per hour per IP
- **File Uploads**: 10 requests per minute per user

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests

---

## Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **OTP Verification**: Phone number verification required
3. **Rate Limiting**: Prevents API abuse
4. **Permission Classes**: Role-based access control
5. **Security Headers**: XSS protection, CSRF protection
6. **Request Logging**: All API requests are logged
7. **Data Validation**: Comprehensive input validation

---

## Development Setup

### Environment Variables
Create a `.env` file with:
```
DEBUG=True
SECRET_KEY=your-secret-key
AFRICASTALKING_USERNAME=sandbox
AFRICASTALKING_API_KEY=your-api-key
USE_MOCK_SMS=True
```

### Running the Server
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Testing
Access the API at `http://localhost:8000/api/`

Admin interface: `http://localhost:8000/admin/`