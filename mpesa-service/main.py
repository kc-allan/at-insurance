from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import uvicorn
import os
import requests
import json
import base64
import hashlib
import time
from datetime import datetime, timedelta
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="M-Pesa Insurance Payment Service",
    description="M-Pesa integration service for Africas Insurance Platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# M-Pesa Configuration
MPESA_CONFIG = {
    "consumer_key": os.getenv("MPESA_CONSUMER_KEY", "your_consumer_key"),
    "consumer_secret": os.getenv("MPESA_CONSUMER_SECRET", "your_consumer_secret"),
    "passkey": os.getenv("MPESA_PASSKEY", "your_passkey"),
    "business_shortcode": os.getenv("MPESA_BUSINESS_SHORTCODE", "174379"),
    "environment": os.getenv("MPESA_ENVIRONMENT", "sandbox"),  # sandbox or production
    "callback_url": os.getenv("MPESA_CALLBACK_URL", "http://localhost:8001/payment/callback"),
    "timeout_url": os.getenv("MPESA_TIMEOUT_URL", "http://localhost:8001/payment/timeout"),
}

# Base URLs for M-Pesa API
if MPESA_CONFIG["environment"] == "sandbox":
    BASE_URL = "https://sandbox.safaricom.co.ke"
else:
    BASE_URL = "https://api.safaricom.co.ke"

# In-memory storage for transactions (in production, use a database)
transactions = {}

# Pydantic models
class PaymentRequest(BaseModel):
    phone_number: str = Field(..., description="Phone number in format 254700000000")
    amount: float = Field(..., gt=0, description="Payment amount")
    reference: str = Field(..., description="Unique reference for the transaction")
    description: str = Field(default="Insurance Payment", description="Payment description")
    policy_id: Optional[str] = Field(None, description="Policy ID being paid for")

class PaymentResponse(BaseModel):
    success: bool
    transaction_id: Optional[str] = None
    checkout_request_id: Optional[str] = None
    message: str
    timestamp: datetime = Field(default_factory=datetime.now)

class PaymentStatusRequest(BaseModel):
    transaction_id: str = Field(..., description="Transaction ID to check")

class StatusResponse(BaseModel):
    success: bool
    status: str
    message: str
    transaction_id: str
    amount: Optional[float] = None
    phone_number: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)

class CallbackData(BaseModel):
    Body: Dict[str, Any]

# M-Pesa API Functions
def get_access_token():
    """Get M-Pesa access token"""
    try:
        url = f"{BASE_URL}/oauth/v1/generate?grant_type=client_credentials"
        auth = base64.b64encode(
            f"{MPESA_CONFIG['consumer_key']}:{MPESA_CONFIG['consumer_secret']}".encode()
        ).decode()
        
        headers = {
            "Authorization": f"Basic {auth}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        return data.get("access_token")
    except Exception as e:
        logger.error(f"Error getting access token: {e}")
        raise HTTPException(status_code=500, detail="Failed to get access token")

def generate_password():
    """Generate M-Pesa API password"""
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password_str = f"{MPESA_CONFIG['business_shortcode']}{MPESA_CONFIG['passkey']}{timestamp}"
    password = base64.b64encode(password_str.encode()).decode()
    return password, timestamp

def initiate_stk_push(phone_number: str, amount: int, reference: str, description: str):
    """Initiate STK push to customer's phone"""
    try:
        access_token = get_access_token()
        password, timestamp = generate_password()
        
        url = f"{BASE_URL}/mpesa/stkpush/v1/processrequest"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "BusinessShortCode": MPESA_CONFIG["business_shortcode"],
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone_number,
            "PartyB": MPESA_CONFIG["business_shortcode"],
            "PhoneNumber": phone_number,
            "CallBackURL": MPESA_CONFIG["callback_url"],
            "AccountReference": reference,
            "TransactionDesc": description
        }
        
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        logger.info(f"STK Push response: {data}")
        
        return data
    except Exception as e:
        logger.error(f"Error initiating STK push: {e}")
        raise HTTPException(status_code=500, detail=f"STK push failed: {str(e)}")

def check_transaction_status(checkout_request_id: str):
    """Check transaction status using checkout request ID"""
    try:
        access_token = get_access_token()
        password, timestamp = generate_password()
        
        url = f"{BASE_URL}/mpesa/stkpushquery/v1/query"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "BusinessShortCode": MPESA_CONFIG["business_shortcode"],
            "Password": password,
            "Timestamp": timestamp,
            "CheckoutRequestID": checkout_request_id
        }
        
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        logger.info(f"Transaction status response: {data}")
        
        return data
    except Exception as e:
        logger.error(f"Error checking transaction status: {e}")
        raise HTTPException(status_code=500, detail=f"Status check failed: {str(e)}")

# API Endpoints
@app.get("/")
async def root():
    return {
        "message": "M-Pesa Insurance Payment Service",
        "status": "healthy",
        "version": "1.0.0",
        "environment": MPESA_CONFIG["environment"]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "mpesa",
        "environment": MPESA_CONFIG["environment"],
        "timestamp": datetime.now()
    }

@app.post("/payment/initiate", response_model=PaymentResponse)
async def initiate_payment(request: PaymentRequest):
    """
    Initiate an M-Pesa payment for insurance
    """
    try:
        # Validate phone number format
        if not request.phone_number.startswith("254") or len(request.phone_number) != 12:
            raise HTTPException(status_code=400, detail="Phone number must be in format 254700000000")
        
        # Convert amount to integer (M-Pesa expects whole numbers)
        amount = int(request.amount)
        if amount < 1:
            raise HTTPException(status_code=400, detail="Amount must be at least 1 KES")
        
        # Generate unique transaction ID
        transaction_id = f"TXN_{datetime.now().strftime('%Y%m%d%H%M%S')}_{request.reference}"
        
        # Initiate STK push
        stk_response = initiate_stk_push(
            phone_number=request.phone_number,
            amount=amount,
            reference=request.reference,
            description=request.description
        )
        
        # Store transaction details
        checkout_request_id = stk_response.get("CheckoutRequestID")
        if checkout_request_id:
            transactions[checkout_request_id] = {
                "transaction_id": transaction_id,
                "phone_number": request.phone_number,
                "amount": amount,
                "reference": request.reference,
                "description": request.description,
                "policy_id": request.policy_id,
                "status": "pending",
                "created_at": datetime.now(),
                "checkout_request_id": checkout_request_id
            }
        
        return PaymentResponse(
            success=True,
            transaction_id=transaction_id,
            checkout_request_id=checkout_request_id,
            message="Payment initiated successfully. Please check your phone for the M-Pesa prompt."
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Payment initiation error: {e}")
        raise HTTPException(status_code=500, detail=f"Payment initiation failed: {str(e)}")

@app.post("/payment/status", response_model=StatusResponse)
async def check_payment_status(request: PaymentStatusRequest):
    """
    Check the status of an M-Pesa payment
    """
    try:
        # Find transaction by ID
        transaction = None
        checkout_request_id = None
        
        for req_id, trans in transactions.items():
            if trans["transaction_id"] == request.transaction_id:
                transaction = trans
                checkout_request_id = req_id
                break
        
        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        # Check status with M-Pesa API
        if checkout_request_id:
            status_response = check_transaction_status(checkout_request_id)
            
            # Update transaction status based on response
            result_code = status_response.get("ResultCode")
            if result_code == "0":
                transaction["status"] = "completed"
                message = "Payment completed successfully"
            elif result_code == "1":
                transaction["status"] = "pending"
                message = "Payment is being processed"
            elif result_code == "1032":
                transaction["status"] = "cancelled"
                message = "Payment was cancelled by user"
            else:
                transaction["status"] = "failed"
                message = f"Payment failed: {status_response.get('ResultDesc', 'Unknown error')}"
        else:
            message = "Transaction status unknown"
        
        return StatusResponse(
            success=True,
            status=transaction["status"],
            message=message,
            transaction_id=transaction["transaction_id"],
            amount=transaction["amount"],
            phone_number=transaction["phone_number"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Status check error: {e}")
        raise HTTPException(status_code=500, detail=f"Status check failed: {str(e)}")

@app.post("/payment/callback")
async def payment_callback(data: CallbackData):
    """
    Handle M-Pesa payment callbacks
    """
    try:
        callback_data = data.Body.get("stkCallback", {})
        checkout_request_id = callback_data.get("CheckoutRequestID")
        result_code = callback_data.get("ResultCode")
        result_desc = callback_data.get("ResultDesc")
        
        logger.info(f"Received callback for {checkout_request_id}: {result_code} - {result_desc}")
        
        # Update transaction status
        if checkout_request_id in transactions:
            transaction = transactions[checkout_request_id]
            
            if result_code == "0":
                transaction["status"] = "completed"
                # Extract payment details from callback
                if "CallbackMetadata" in callback_data:
                    metadata = callback_data["CallbackMetadata"].get("Item", [])
                    for item in metadata:
                        if item.get("Name") == "Amount":
                            transaction["paid_amount"] = item.get("Value")
                        elif item.get("Name") == "MpesaReceiptNumber":
                            transaction["receipt_number"] = item.get("Value")
                        elif item.get("Name") == "TransactionDate":
                            transaction["transaction_date"] = item.get("Value")
            else:
                transaction["status"] = "failed"
                transaction["failure_reason"] = result_desc
            
            transaction["updated_at"] = datetime.now()
            
            logger.info(f"Updated transaction {transaction['transaction_id']} status to {transaction['status']}")
        
        return {"status": "received", "message": "Callback processed successfully"}
        
    except Exception as e:
        logger.error(f"Callback processing error: {e}")
        raise HTTPException(status_code=500, detail=f"Callback processing failed: {str(e)}")

@app.get("/transactions")
async def get_transactions():
    """
    Get all transactions (for debugging/admin purposes)
    """
    return {
        "transactions": transactions,
        "count": len(transactions)
    }

@app.get("/config")
async def get_config():
    """
    Get M-Pesa configuration (without sensitive data)
    """
    return {
        "environment": MPESA_CONFIG["environment"],
        "business_shortcode": MPESA_CONFIG["business_shortcode"],
        "callback_url": MPESA_CONFIG["callback_url"],
        "timeout_url": MPESA_CONFIG["timeout_url"]
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port) 