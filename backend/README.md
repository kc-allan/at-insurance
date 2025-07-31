# AT Insurance Backend API

A comprehensive Django REST API for managing farmer insurance services in Kenya. Built with Django REST Framework, JWT authentication, and OTP-based phone verification.

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![Django](https://img.shields.io/badge/Django-5.2.3-green)
![DRF](https://img.shields.io/badge/Django%20REST%20Framework-3.16.0-red)
![License](https://img.shields.io/badge/License-Proprietary-yellow)

## 🌾 Overview

AT Insurance provides a digital platform for farmers to:
- Register and verify their identity using phone numbers
- Browse and subscribe to various agriculture insurance policies
- File and track insurance claims
- Make premium payments via mobile money (M-Pesa)
- Upload and manage insurance documents
- Receive SMS notifications for important updates

## 🚀 Features

### Authentication & User Management
- **OTP-based Registration**: Secure phone number verification
- **JWT Authentication**: Stateless token-based authentication
- **Custom User Model**: Farmer-specific profile fields
- **Phone Number Login**: No passwords needed - use OTP for login

### Insurance Management
- **Policy Browsing**: View available insurance policies
- **Premium Calculator**: Calculate costs before subscribing
- **Subscription Management**: Subscribe, view, and cancel policies
- **Claims Processing**: File claims with document uploads
- **Payment Integration**: M-Pesa and bank transfer support

### Security Features
- **Rate Limiting**: API abuse prevention
- **Permission Classes**: Role-based access control
- **Security Headers**: XSS, CSRF, and other security protections
- **Request Logging**: Comprehensive audit trails
- **Data Validation**: Input sanitization and validation

### SMS Integration
- **Africa's Talking API**: Professional SMS delivery
- **Mock SMS Service**: Development-friendly testing
- **Automated Notifications**: OTP, welcome, claim updates, payment confirmations

## 📋 API Flow

### 1. User Registration/Login Flow
```mermaid
sequenceDiagram
    participant Client
    participant API
    participant SMS
    participant Database

    Client->>API: POST /api/accounts/auth/send-otp/
    API->>Database: Create OTP record
    API->>SMS: Send OTP via SMS
    SMS-->>Client: Receive OTP
    Client->>API: POST /api/accounts/auth/verify-otp/
    API->>Database: Verify OTP & Create/Login User
    API-->>Client: Return JWT tokens
```

### 2. Policy Subscription Flow
```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Database

    Client->>API: GET /api/core/policies/
    API-->>Client: Return available policies
    Client->>API: POST /api/core/calculate-premium/
    API-->>Client: Return calculated premium
    Client->>API: POST /api/core/subscriptions/
    API->>Database: Create subscription
    API-->>Client: Return subscription details
    Client->>API: POST /api/core/initiate-payment/
    API-->>Client: Return payment instructions
```

### 3. Claims Processing Flow
```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Staff
    participant Database

    Client->>API: POST /api/core/claims/
    API->>Database: Create claim record
    API-->>Client: Return claim number
    Staff->>Database: Review & assess claim
    Database->>API: Update claim status
    API->>Client: Send SMS notification
```

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.10+
- PostgreSQL (for production) or SQLite (for development)
- Redis (for caching and rate limiting)

### 1. Clone Repository
```bash
git clone <repository-url>
cd at-insurance/backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration
Create a `.env` file in the project root:
```env
# Django Settings
DEBUG=True
SECRET_KEY=your-super-secret-key-here

# Database (for production)
DATABASE_URL=postgresql://user:password@localhost/atinsurance

# SMS Configuration (Africa's Talking)
AFRICASTALKING_USERNAME=your-username
AFRICASTALKING_API_KEY=your-api-key
AFRICASTALKING_SENDER_ID=AT-Insurance
USE_MOCK_SMS=False

# Security
API_RATE_LIMIT=100
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000

# Cache (Redis for production)
REDIS_URL=redis://localhost:6379/0
```

### 5. Database Setup
```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser --phone_number="+254700000000" --email="admin@atinsurance.com"
```

### 6. Load Sample Data (Optional)
```bash
# Create sample policies and data
python manage.py shell
# Then run the sample data creation script
```

### 7. Start Development Server
```bash
python manage.py runserver
```

## 📚 API Documentation

### Interactive Documentation
Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/swagger/
- **ReDoc**: http://localhost:8000/redoc/
- **OpenAPI Schema**: http://localhost:8000/swagger.json

### Quick API Overview

#### Authentication Endpoints
```
POST /api/accounts/auth/send-otp/          # Send OTP to phone
POST /api/accounts/auth/verify-otp/        # Verify OTP & get tokens
POST /api/accounts/auth/refresh/           # Refresh access token
POST /api/accounts/auth/logout/            # Logout user
GET  /api/accounts/profile/                # Get user profile
PUT  /api/accounts/profile/update/         # Update profile
```

#### Core Insurance Endpoints
```
GET  /api/core/policies/                   # List available policies
GET  /api/core/policies/{id}/              # Get policy details
POST /api/core/subscriptions/              # Subscribe to policy
GET  /api/core/subscriptions/              # List user subscriptions
GET  /api/core/subscriptions/active/       # Get active subscriptions
POST /api/core/subscriptions/{id}/cancel/  # Cancel subscription
POST /api/core/claims/                     # File insurance claim
GET  /api/core/claims/                     # List user claims
GET  /api/core/claims/pending/             # Get pending claims
GET  /api/core/payments/                   # Payment history
POST /api/core/initiate-payment/           # Initiate payment
POST /api/core/calculate-premium/          # Calculate premium
GET  /api/core/dashboard/                  # Dashboard statistics
```

### Sample API Calls

#### 1. Send OTP
```bash
curl -X POST http://localhost:8000/api/accounts/auth/send-otp/ \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+254712345678", "registration": false}'
```

#### 2. Verify OTP & Login
```bash
curl -X POST http://localhost:8000/api/accounts/auth/verify-otp/ \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+254712345678",
    "otp_code": "123456",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

#### 3. Get Policies (with authentication)
```bash
curl -X GET http://localhost:8000/api/core/policies/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4. Calculate Premium
```bash
curl -X POST http://localhost:8000/api/core/calculate-premium/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"policy_id": 1, "sum_insured": 50000}'
```

## 🏗️ Project Structure

```
backend/
├── accounts/                 # User authentication & management
│   ├── models.py            # Custom User, OTP, FarmPhoto models
│   ├── serializers.py       # Authentication serializers
│   ├── views.py             # Authentication views
│   ├── utils.py             # OTP utilities
│   ├── sms_service.py       # SMS service integration
│   └── admin.py             # Admin configuration
├── core/                    # Insurance core functionality
│   ├── models.py            # Policy, Subscription, Claim, Payment models
│   ├── serializers.py       # Core serializers
│   ├── views.py             # Core API views
│   ├── permissions.py       # Custom permissions
│   ├── middleware.py        # Security middleware
│   └── admin.py             # Admin configuration
├── backend/                 # Django project settings
│   ├── settings.py          # Configuration
│   ├── urls.py              # URL routing
│   └── wsgi.py              # WSGI application
├── requirements.txt         # Python dependencies
├── manage.py               # Django management script
└── README.md               # This file
```

## 🔒 Security Considerations

### Authentication Security
- JWT tokens with configurable expiration
- Refresh token rotation
- OTP rate limiting (3 attempts per hour)
- Phone number verification required

### API Security
- Rate limiting: 100 requests/minute per IP
- Security headers (XSS, CSRF, HSTS)
- Permission-based access control
- Input validation and sanitization
- Request logging and monitoring

### Data Protection
- Encrypted sensitive data in transit
- Proper field-level permissions
- User data isolation
- Audit trails for financial transactions

## 🧪 Testing

### Run Tests
```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test accounts
python manage.py test core

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

### API Testing with Postman
Import the Postman collection from `/docs/AT_Insurance_API.postman_collection.json`

## 🚀 Deployment

### Production Checklist
- [ ] Set `DEBUG=False`
- [ ] Configure proper database (PostgreSQL)
- [ ] Set up Redis for caching
- [ ] Configure Africa's Talking SMS
- [ ] Set up proper logging
- [ ] Configure static files serving
- [ ] Set up SSL/HTTPS
- [ ] Configure environment variables
- [ ] Set up monitoring and alerts

### Docker Deployment
```bash
# Build and run with Docker
docker build -t at-insurance-backend .
docker run -p 8000:8000 at-insurance-backend
```

### Production Environment Variables
```env
DEBUG=False
SECRET_KEY=your-production-secret-key
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://host:port/db
AFRICASTALKING_USERNAME=production-username
AFRICASTALKING_API_KEY=production-api-key
ALLOWED_HOSTS=yourdomain.com,api.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

## 📱 Mobile App Integration

### Authentication Flow for Mobile Apps
1. Collect phone number from user
2. Call `/api/accounts/auth/send-otp/`
3. Show OTP input screen
4. Call `/api/accounts/auth/verify-otp/`
5. Store JWT tokens securely
6. Use access token for API calls
7. Refresh token when needed

### Recommended Mobile Libraries
- **React Native**: axios, @react-native-async-storage/async-storage
- **Flutter**: dio, flutter_secure_storage
- **Ionic**: @ionic/storage

## 🔧 Troubleshooting

### Common Issues

#### Migration Issues
```bash
# Reset migrations (development only)
python manage.py migrate accounts zero
python manage.py migrate core zero
python manage.py migrate

# Or delete migration files and recreate
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
python manage.py makemigrations
python manage.py migrate
```

#### OTP Not Received
1. Check SMS service configuration
2. Verify phone number format (+254XXXXXXXXX)
3. Check rate limiting (wait 1 hour if exceeded)
4. Review SMS service logs

#### Authentication Issues
1. Verify JWT token format
2. Check token expiration
3. Ensure user is verified (is_verified=True)
4. Check permission requirements

### Debug Mode
Enable debug logging in settings:
```python
LOGGING = {
    'version': 1,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow PEP 8 guidelines
- Use meaningful variable names
- Write docstrings for functions and classes
- Add comments for complex logic

## 📞 Support

For technical support, please contact:
- **Email**: support@atinsurance.com
- **Phone**: +254 700 000 000
- **Documentation**: [API Docs](http://localhost:8000/swagger/)

## 📄 License

This project is proprietary software. All rights reserved.

---

## 🙏 Acknowledgments

- Django and Django REST Framework communities
- Africa's Talking for SMS services
- The farming community in Kenya for inspiration

**Built with ❤️ for Kenyan farmers**