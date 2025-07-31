# AT Insurance API - Frontend Integration Guide

A simplified farmers insurance management API with phone-based authentication.

## 🚀 Quick Start

**Base URL:** `http://localhost:8000`  
**API Version:** v1  
**Authentication:** JWT Bearer Token

## 📱 Authentication Flow

### Secure 2-Step Authentication
1. **Register** new farmers with basic info + password
2. **Login** existing farmers with phone number + password

No OTP codes, no SMS waiting - secure and instant access!

## 🔐 Authentication Endpoints

### 1. Register New Farmer
```http
POST /api/accounts/auth/register/
Content-Type: application/json

{
  "phone_number": "+254712345678",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "password_confirm": "SecurePass123",
  "county": "Nairobi",
  "sub_county": "Westlands",
  "farming_type": "mixed",
  "farm_size_acres": 5.0,
  "primary_crops": ["maize", "beans"]
}
```

**Response (201 Created):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "phone_number": "+254712345678",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "email": "john@example.com",
    "county": "Nairobi",
    "sub_county": "Westlands",
    "farming_type": "mixed",
    "farm_size_acres": "5.00",
    "primary_crops": ["maize", "beans"],
    "is_verified": true,
    "date_joined": "2024-01-15T10:30:00Z"
  },
  "message": "Registration successful"
}
```

### 2. Login Existing Farmer
```http
POST /api/accounts/auth/login/
Content-Type: application/json

{
  "phone_number": "+254712345678",
  "password": "SecurePass123"
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "phone_number": "+254712345678",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe"
  },
  "message": "Login successful"
}
```

### 3. Refresh Token
```http
POST /api/accounts/auth/refresh/
Content-Type: application/json

{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 4. Logout
```http
POST /api/accounts/auth/logout/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## 👤 Profile Management

### Get User Profile
```http
GET /api/accounts/profile/
Authorization: Bearer <access_token>
```

### Update Profile
```http
PATCH /api/accounts/profile/update/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "county": "Nairobi",
  "sub_county": "Westlands",
  "farming_type": "commercial",
  "farm_size_acres": 10.0,
  "primary_crops": ["maize", "beans", "tomatoes"]
}
```

## 🏛️ Insurance Policies

### List Available Policies
```http
GET /api/core/policies/
# Optional filters: ?policy_type=crop&search=maize
```

### Get Policy Details
```http
GET /api/core/policies/{id}/
```

## 📋 Subscriptions

### List My Subscriptions
```http
GET /api/core/subscriptions/
Authorization: Bearer <access_token>
# Optional filters: ?status=active&is_paid=true
```

### Subscribe to Policy
```http
POST /api/core/subscriptions/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "policy": 1,
  "sum_insured": 50000.00,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31"
}
```

**Optional fields**: `insured_area_acres`, `insured_crop`, `insured_livestock_count`, `asset_details`

### Get Active Subscriptions
```http
GET /api/core/subscriptions/active/
Authorization: Bearer <access_token>
```

### Cancel Subscription
```http
POST /api/core/subscriptions/{id}/cancel/
Authorization: Bearer <access_token>
```

## 📄 Claims Management

### List My Claims
```http
GET /api/core/claims/
Authorization: Bearer <access_token>
# Optional filters: ?status=submitted&claim_type=crop_loss
```

### File New Claim
```http
POST /api/core/claims/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "subscription": 1,
  "claim_type": "crop_loss",
  "incident_date": "2024-01-15",
  "description": "Crop destroyed by drought conditions",
  "loss_amount": 25000.00
}
```

**All fields are required for claim filing**

### Get Pending Claims
```http
GET /api/core/claims/pending/
Authorization: Bearer <access_token>
```

## 💰 Payments

### Payment History
```http
GET /api/core/payments/
Authorization: Bearer <access_token>
# Optional filters: ?payment_type=premium&payment_method=mpesa
```

### Initiate Payment
```http
POST /api/core/initiate-payment/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "subscription_id": 1,
  "payment_method": "mpesa"
}
```

**Optional field**: `phone_number` (defaults to user's phone number)

## 🧮 Utilities

### Calculate Premium
```http
POST /api/core/calculate-premium/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "policy_id": 1,
  "sum_insured": 50000.00
}
```

### Dashboard Stats
```http
GET /api/core/dashboard/
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "subscriptions": {
    "total": 3,
    "active": 2
  },
  "claims": {
    "total": 1,
    "pending": 0,
    "approved": 1
  },
  "financials": {
    "total_premiums_paid": 15000.00,
    "claims_received": 25000.00
  }
}
```

## 📁 Document Upload

### Upload Document
```http
POST /api/core/documents/
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

document_type: farm_photo
description: Photo of maize farm
file: <file_data>
```

### List Documents
```http
GET /api/core/documents/
Authorization: Bearer <access_token>
# Optional filter: ?document_type=farm_photo
```

## 🛠️ Frontend Implementation

### React/JavaScript Example

```javascript
// API Client Setup
const API_BASE = 'http://localhost:8000';

class ATInsuranceAPI {
  constructor() {
    this.token = localStorage.getItem('access_token');
  }

  // Set authorization header
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Register new farmer
  async register(userData) {
    const response = await fetch(`${API_BASE}/api/accounts/auth/register/`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      this.token = data.access;
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      return data;
    }
    
    throw new Error(data.error || 'Registration failed');
  }

  // Login existing farmer
  async login(phoneNumber, password) {
    const response = await fetch(`${API_BASE}/api/accounts/auth/login/`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ 
        phone_number: phoneNumber,
        password: password 
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      this.token = data.access;
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      return data;
    }
    
    throw new Error(data.error || 'Login failed');
  }

  // Get user profile
  async getProfile() {
    const response = await fetch(`${API_BASE}/api/accounts/profile/`, {
      headers: this.getHeaders(),
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to fetch profile');
  }

  // Get dashboard stats
  async getDashboard() {
    const response = await fetch(`${API_BASE}/api/core/dashboard/`, {
      headers: this.getHeaders(),
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to fetch dashboard');
  }

  // List policies
  async getPolicies(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE}/api/core/policies/?${params}`);
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to fetch policies');
  }

  // Subscribe to policy
  async subscribeToPlan(subscriptionData) {
    const response = await fetch(`${API_BASE}/api/core/subscriptions/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(subscriptionData),
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    const error = await response.json();
    throw new Error(error.error || 'Subscription failed');
  }

  // File claim
  async fileClaim(claimData) {
    const response = await fetch(`${API_BASE}/api/core/claims/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(claimData),
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    const error = await response.json();
    throw new Error(error.error || 'Claim filing failed');
  }

  // Logout
  async logout() {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      await fetch(`${API_BASE}/api/accounts/auth/logout/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    }
    
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}

// Usage Example
const api = new ATInsuranceAPI();

// Register new farmer
try {
  const result = await api.register({
    phone_number: '+254712345678',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    password: 'SecurePass123',
    password_confirm: 'SecurePass123',
    county: 'Nairobi',
    farming_type: 'mixed',
    farm_size_acres: 5.0,
    primary_crops: ['maize', 'beans']
  });
  
  console.log('Registration successful:', result.user);
} catch (error) {
  console.error('Registration failed:', error.message);
}

// Login existing farmer
try {
  const result = await api.login('+254712345678', 'SecurePass123');
  console.log('Login successful:', result.user);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

## ⚠️ Error Handling

### Common HTTP Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid data provided
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Permission denied
- **404 Not Found** - Resource not found
- **409 Conflict** - Resource already exists
- **500 Internal Server Error** - Server error

### Error Response Format
```json
{
  "error": "Descriptive error message",
  "field_errors": {
    "phone_number": ["This field is required."],
    "email": ["Enter a valid email address."]
  }
}
```

## 🔍 API Documentation

- **Swagger UI**: `http://localhost:8000/swagger/`
- **ReDoc**: `http://localhost:8000/redoc/`

## 📞 Phone Number Format

All phone numbers should be in Kenya format:
- **Accepted formats**: `+254712345678`, `0712345678`, `254712345678`
- **Normalized to**: `+254712345678`

## 🎯 Key Features for Frontend

1. **Secure Registration** - Phone number + password authentication
2. **Simple Login** - Phone number + password
3. **JWT Authentication** - Secure and stateless
4. **Password Security** - Proper hashing and validation
5. **Comprehensive Profiles** - Rich farmer data
6. **Real-time Dashboard** - Live statistics
7. **Policy Management** - Browse and subscribe
8. **Claims Processing** - File and track claims
9. **Payment Integration** - Premium and claim payments
10. **Document Upload** - Farm photos and documents

## 🚀 Development Tips

1. **Store tokens securely** (use secure storage in mobile apps)
2. **Handle token expiry** with refresh token logic
3. **Implement proper error handling** for network issues
4. **Use loading states** for better UX
5. **Cache user data** appropriately
6. **Validate phone numbers** on the frontend
7. **Validate passwords** (minimum 6 characters)
8. **Show progress indicators** for file uploads
9. **Hash/mask passwords** in forms for security
10. **Implement password confirmation** matching

## 🔒 Security Features

- **Password Hashing** - All passwords are securely hashed using Django's built-in PBKDF2 algorithm
- **Phone Number Validation** - Automatic format validation and normalization
- **JWT Tokens** - Secure, stateless authentication with expiry
- **Input Validation** - Server-side validation for all user inputs
- **CORS Protection** - Configured for secure cross-origin requests

This API provides **secure and farmer-friendly** authentication - simple registration and login process with robust security measures! 🌾