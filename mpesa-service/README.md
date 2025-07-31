# M-Pesa Insurance Payment Service

This is a FastAPI service that provides M-Pesa payment integration for the Africas Insurance platform. It handles STK push payments, payment status checking, and callback processing.

## Features

- ✅ STK Push payment initiation
- ✅ Payment status checking
- ✅ Callback handling for payment confirmations
- ✅ Transaction tracking
- ✅ Sandbox and production environment support
- ✅ Comprehensive error handling
- ✅ API documentation with Swagger UI

## Setup

### 1. Install Dependencies

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure M-Pesa Credentials

Copy the example environment file and configure your M-Pesa credentials:

```bash
cp env.example .env
```

Edit `.env` with your actual M-Pesa credentials:

```env
# M-Pesa API Configuration
MPESA_CONSUMER_KEY=your_actual_consumer_key
MPESA_CONSUMER_SECRET=your_actual_consumer_secret
MPESA_PASSKEY=your_actual_passkey
MPESA_BUSINESS_SHORTCODE=174379
MPESA_ENVIRONMENT=sandbox

# Service URLs
MPESA_CALLBACK_URL=http://localhost:8001/payment/callback
MPESA_TIMEOUT_URL=http://localhost:8001/payment/timeout

# Service Configuration
PORT=8001
```

### 3. Get M-Pesa Credentials

To get your M-Pesa API credentials:

1. **Sandbox Testing**: Visit [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. **Production**: Contact Safaricom for production credentials
3. **Test Phone Numbers**: Use test numbers like `254708374149` for sandbox testing

### 4. Run the Service

```bash
# Activate virtual environment
source venv/bin/activate

# Run the service
python main.py
```

The service will start on `http://localhost:8001`

## API Endpoints

### Health Check
- `GET /health` - Check service health

### Payment Operations
- `POST /payment/initiate` - Initiate M-Pesa payment
- `POST /payment/status` - Check payment status
- `POST /payment/callback` - Handle M-Pesa callbacks

### Admin/Debug
- `GET /transactions` - View all transactions
- `GET /config` - View service configuration

## API Documentation

Once the service is running, visit:
- **Swagger UI**: `http://localhost:8001/docs`
- **ReDoc**: `http://localhost:8001/redoc`

## Usage Examples

### 1. Initiate Payment

```bash
curl -X POST "http://localhost:8001/payment/initiate" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "254700000000",
    "amount": 1000.00,
    "reference": "INSURANCE_001",
    "description": "Crop Insurance Premium",
    "policy_id": "POL_123"
  }'
```

### 2. Check Payment Status

```bash
curl -X POST "http://localhost:8001/payment/status" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "TXN_20250131123456_INSURANCE_001"
  }'
```

### 3. Test Health Check

```bash
curl http://localhost:8001/health
```

## Integration with NestJS Backend

The NestJS backend can communicate with this service via HTTP requests. The backend is configured to make calls to `http://localhost:8001` for M-Pesa operations.

### Example NestJS Integration

```typescript
// In your NestJS service
async initiatePayment(paymentRequest: PaymentRequest) {
  const response = await axios.post(
    'http://localhost:8001/payment/initiate',
    paymentRequest
  );
  return response.data;
}
```

## Testing

### Sandbox Testing

1. Use test phone numbers: `254708374149`, `254708374150`, etc.
2. Use small amounts (1-100 KES) for testing
3. Check the M-Pesa sandbox app for payment prompts

### Production Testing

1. Use real phone numbers
2. Test with small amounts first
3. Monitor logs for any issues

## Error Handling

The service includes comprehensive error handling:

- **400**: Invalid request data (phone number format, amount, etc.)
- **404**: Transaction not found
- **500**: Internal server error or M-Pesa API errors
- **503**: M-Pesa service unavailable

## Logging

The service logs all operations to help with debugging:

```bash
# View logs
tail -f logs/mpesa.log
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **HTTPS**: Use HTTPS in production for all API calls
3. **Validation**: All inputs are validated before processing
4. **Rate Limiting**: Consider implementing rate limiting for production

## Troubleshooting

### Common Issues

1. **"Access token failed"**: Check your consumer key and secret
2. **"STK push failed"**: Verify phone number format and amount
3. **"Callback not received"**: Check callback URL configuration
4. **"Transaction not found"**: Verify transaction ID format

### Debug Mode

Enable debug logging by setting the log level:

```python
logging.basicConfig(level=logging.DEBUG)
```

## Production Deployment

For production deployment:

1. Use a production database instead of in-memory storage
2. Set up proper logging and monitoring
3. Use HTTPS for all endpoints
4. Implement rate limiting
5. Set up health checks and monitoring
6. Use environment-specific configurations

## Support

For issues and questions:
1. Check the logs for error details
2. Verify your M-Pesa credentials
3. Test with sandbox environment first
4. Contact Safaricom support for M-Pesa API issues 