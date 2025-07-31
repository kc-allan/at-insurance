import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MpesaService, PaymentRequest, PaymentStatusRequest } from './mpesa.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('M-Pesa Payments')
@Controller('mpesa')
export class MpesaController {
  constructor(private readonly mpesaService: MpesaService) {}

  @Get('health')
  @ApiOperation({ summary: 'Check M-Pesa service health' })
  @ApiResponse({ status: 200, description: 'M-Pesa service is healthy' })
  @ApiResponse({ status: 503, description: 'M-Pesa service is not available' })
  async healthCheck() {
    return this.mpesaService.healthCheck();
  }

  @Post('payment/initiate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate M-Pesa payment' })
  @ApiResponse({ status: 201, description: 'Payment initiated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payment request' })
  @ApiResponse({ status: 500, description: 'Payment initiation failed' })
  async initiatePayment(
    @Body() paymentRequest: PaymentRequest,
    @Request() req: any
  ) {
    // Add user context to the payment request
    const enhancedRequest = {
      ...paymentRequest,
      user_id: req.user.id,
      user_phone: req.user.phone,
    };

    return this.mpesaService.initiatePayment(enhancedRequest);
  }

  @Post('payment/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check payment status' })
  @ApiResponse({ status: 200, description: 'Payment status retrieved' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 500, description: 'Status check failed' })
  async checkPaymentStatus(@Body() statusRequest: PaymentStatusRequest) {
    return this.mpesaService.checkPaymentStatus(statusRequest);
  }
} 