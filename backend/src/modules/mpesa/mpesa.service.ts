import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface PaymentRequest {
  phone_number: string;
  amount: number;
  reference: string;
  description?: string;
}

export interface PaymentResponse {
  success: boolean;
  transaction_id?: string;
  message: string;
  timestamp: string;
}

export interface PaymentStatusRequest {
  transaction_id: string;
}

export interface StatusResponse {
  success: boolean;
  status: string;
  message: string;
  timestamp: string;
}

@Injectable()
export class MpesaService {
  private readonly mpesaServiceUrl: string;

  constructor(private configService: ConfigService) {
    this.mpesaServiceUrl = this.configService.get<string>('MPESA_SERVICE_URL', 'http://localhost:8001');
  }

  async initiatePayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await axios.post(
        `${this.mpesaServiceUrl}/payment/initiate`,
        paymentRequest,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          `M-Pesa payment initiation failed: ${error.response?.data?.detail || error.message}`,
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      throw new HttpException(
        'M-Pesa payment initiation failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async checkPaymentStatus(statusRequest: PaymentStatusRequest): Promise<StatusResponse> {
    try {
      const response = await axios.post(
        `${this.mpesaServiceUrl}/payment/status`,
        statusRequest,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 15000, // 15 seconds timeout
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          `M-Pesa status check failed: ${error.response?.data?.detail || error.message}`,
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      throw new HttpException(
        'M-Pesa status check failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async healthCheck(): Promise<{ status: string; service: string; timestamp: string }> {
    try {
      const response = await axios.get(`${this.mpesaServiceUrl}/health`, {
        timeout: 5000, // 5 seconds timeout
      });

      return response.data;
    } catch (error) {
      throw new HttpException(
        'M-Pesa service is not available',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
} 