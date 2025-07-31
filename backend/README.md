# Africas Insurance Backend API

Backend API for the Africas Insurance Platform - A comprehensive agriculture insurance system for Kenyan farmers.

## 🚀 Features

- **Phone-based OTP Authentication** - Secure login via SMS verification
- **Farmer Management** - User profiles and account management
- **Policy Management** - Create, view, and renew insurance policies
- **Claims Processing** - Submit and track insurance claims with image uploads
- **JWT Authentication** - Secure API access with Bearer tokens
- **File Upload Support** - ID documents and claim evidence uploads
- **API Documentation** - Interactive Swagger/OpenAPI docs

## 🛠️ Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: MySQL with TypeORM
- **Authentication**: JWT + Passport
- **File Upload**: Multer
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator

## 📦 Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and other configurations

# Start the development server
npm run start:dev
```

## 🗄️ Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE africas_insurance;
```

2. Update `.env` with your database credentials

3. The application will automatically create tables on first run (synchronize: true in development)

## 🔧 Environment Variables

```env
NODE_ENV=development
PORT=8000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=africas_insurance
JWT_SECRET=your-secret-key
```

## 📚 API Documentation

Once the server is running, visit:
- **API Docs**: http://localhost:8000/api/docs
- **Health Check**: http://localhost:8000/api

## 🔐 Authentication Flow

1. **Send OTP**: `POST /api/auth/send-otp`
2. **Verify OTP**: `POST /api/auth/verify-otp`
3. **Register** (new users): `POST /api/auth/register`
4. **Access Protected Routes**: Include `Authorization: Bearer <token>` header

## 📋 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/register` - Register new farmer
- `GET /api/auth/me` - Get current user profile

### Policies
- `GET /api/policies` - Get farmer's policies
- `GET /api/policies/:id` - Get specific policy
- `POST /api/policies` - Create new policy
- `POST /api/policies/:id/renew` - Renew policy
- `POST /api/policies/calculate-premium` - Calculate premium

### Claims
- `GET /api/claims` - Get farmer's claims
- `GET /api/claims/:id` - Get specific claim
- `GET /api/claims/by-policy/:policyId` - Get claims for policy
- `POST /api/claims` - Submit new claim (supports file upload)

### Farmers
- `GET /api/farmers` - Get all farmers (admin)
- `GET /api/farmers/:id` - Get specific farmer

## 📁 Project Structure

```
src/
├── entities/           # Database entities
│   ├── farmer.entity.ts
│   ├── policy.entity.ts
│   ├── claim.entity.ts
│   ├── claim-image.entity.ts
│   └── otp-session.entity.ts
├── modules/            # Feature modules
│   ├── auth/          # Authentication
│   ├── farmers/       # Farmer management
│   ├── policies/      # Policy management
│   └── claims/        # Claims processing
├── common/            # Shared utilities
│   └── guards/        # Auth guards
├── main.ts           # Application entry point
└── app.module.ts     # Root module
```

## 🔒 Security Features

- **Rate Limiting**: Throttling on all endpoints
- **Input Validation**: Comprehensive DTO validation
- **File Upload Security**: Type and size restrictions
- **JWT Authentication**: Secure token-based auth
- **CORS Protection**: Configured for frontend origins

## 📱 Frontend Integration

The backend is designed to work with the Next.js frontend. Update frontend API calls to use:
- Base URL: `http://localhost:8000/api`
- Authentication: Bearer token in headers
- File uploads: multipart/form-data for claims

## 🚀 Deployment

1. Set `NODE_ENV=production`
2. Update database credentials
3. Set strong JWT secret
4. Configure SMS service for OTP
5. Set up file storage (AWS S3, etc.)
6. Deploy using PM2, Docker, or cloud platform

## 📞 Support

For issues and questions, contact the development team or create an issue in the repository.