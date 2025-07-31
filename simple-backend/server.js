const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for OTPs and users (development only)
const otpStorage = new Map();
const users = new Map();

// Mock user data
users.set('+254712345678', {
  id: '1',
  name: 'John Mwangi',
  phone: '+254712345678',
  county: 'Nakuru',
  joinDate: '2024-01-15'
});

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Validate Kenyan phone number
function isValidKenyanPhone(phone) {
  return /^\+254[17]\d{8}$/.test(phone);
}

// Routes
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  
  if (!phone || !isValidKenyanPhone(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Kenyan phone number format'
    });
  }

  const otp = generateOTP();
  
  // Store OTP with expiration (10 minutes)
  otpStorage.set(phone, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  });

  console.log(`🔐 OTP for ${phone}: ${otp}`);

  res.json({
    success: true,
    message: 'OTP generated successfully',
    otp: otp // Include OTP in response for development
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Phone and OTP are required'
    });
  }

  const storedOtpData = otpStorage.get(phone);
  
  if (!storedOtpData) {
    return res.status(400).json({
      success: false,
      message: 'No OTP found for this phone number'
    });
  }

  if (Date.now() > storedOtpData.expiresAt) {
    otpStorage.delete(phone);
    return res.status(400).json({
      success: false,
      message: 'OTP has expired'
    });
  }

  if (storedOtpData.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP'
    });
  }

  // Remove OTP after successful verification
  otpStorage.delete(phone);

  // Check if user exists or create a mock user for development
  let existingUser = users.get(phone);
  
  if (!existingUser) {
    // For development: Create a mock user for any valid phone number
    existingUser = {
      id: Date.now().toString(),
      name: 'Demo Farmer',
      phone: phone,
      county: 'Nakuru',
      joinDate: new Date().toISOString().split('T')[0]
    };
    users.set(phone, existingUser);
  }
  
  res.json({
    success: true,
    user: existingUser,
    token: 'mock-jwt-token-' + Date.now(),
    isNewUser: false
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, phone, county, idDocument } = req.body;

  if (!name || !phone || !county) {
    return res.status(400).json({
      success: false,
      message: 'Name, phone, and county are required'
    });
  }

  if (users.has(phone)) {
    return res.status(409).json({
      success: false,
      message: 'User with this phone number already exists'
    });
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    phone,
    county,
    idDocument,
    joinDate: new Date().toISOString().split('T')[0]
  };

  users.set(phone, newUser);

  res.status(201).json({
    success: true,
    user: newUser,
    token: 'mock-jwt-token-' + Date.now()
  });
});

app.get('/api/auth/me', (req, res) => {
  // For development, return mock user
  const mockUser = {
    id: '1',
    name: 'John Mwangi',
    phone: '+254712345678',
    county: 'Nakuru',
    joinDate: '2024-01-15'
  };
  
  res.json(mockUser);
});

// Mock policies endpoint
app.get('/api/policies', (req, res) => {
  const mockPolicies = [
    {
      id: 'POL-001',
      farmerId: '1',
      type: 'crop',
      product: 'Maize',
      coverage: '5 acres',
      premium: 2500,
      status: 'active',
      validFrom: '2024-01-01',
      validTo: '2024-12-31'
    },
    {
      id: 'POL-002',
      farmerId: '1',
      type: 'livestock',
      product: 'Dairy Cattle',
      coverage: '3 cows',
      premium: 1800,
      status: 'active',
      validFrom: '2024-02-01',
      validTo: '2025-01-31'
    }
  ];
  
  res.json(mockPolicies);
});

// Health check
app.get('/api', (req, res) => {
  res.json({ message: 'Africas Insurance API is running!' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Africas Insurance Simple API running on http://localhost:${PORT}`);
  console.log(`📚 Test endpoint: http://localhost:${PORT}/api`);
});