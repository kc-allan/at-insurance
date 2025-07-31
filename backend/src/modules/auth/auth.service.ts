import { Injectable, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

import { Farmer } from '../../entities/farmer.entity';
import { OtpSession } from '../../entities/otp-session.entity';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RegisterFarmerDto } from './dto/register-farmer.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Farmer)
    private farmerRepository: Repository<Farmer>,
    @InjectRepository(OtpSession)
    private otpSessionRepository: Repository<OtpSession>,
    private jwtService: JwtService,
  ) {}

  async sendOtp(sendOtpDto: SendOtpDto): Promise<{ success: boolean; message: string; otp?: string }> {
    const { phone } = sendOtpDto;

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Save or update OTP session
    await this.otpSessionRepository.save({
      phone,
      otpCode,
      expiresAt,
    });

    // For development: Return OTP in response (DO NOT USE IN PRODUCTION)
    console.log(`🔐 OTP for ${phone}: ${otpCode}`);

    return {
      success: true,
      message: 'OTP generated successfully',
      otp: otpCode, // Include OTP in response for development
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
    success: boolean;
    user?: Farmer;
    token?: string;
    isNewUser?: boolean;
    message?: string;
  }> {
    const { phone, otp } = verifyOtpDto;

    // Find OTP session
    const otpSession = await this.otpSessionRepository.findOne({
      where: { phone }
    });

    if (!otpSession) {
      throw new BadRequestException('No OTP session found for this phone number');
    }

    // Check if OTP is expired
    if (new Date() > otpSession.expiresAt) {
      await this.otpSessionRepository.remove(otpSession);
      throw new BadRequestException('OTP has expired');
    }

    // Verify OTP
    if (otpSession.otpCode !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Remove OTP session after successful verification
    await this.otpSessionRepository.remove(otpSession);

    // Check if farmer exists
    const existingFarmer = await this.farmerRepository.findOne({
      where: { phone }
    });

    if (existingFarmer) {
      const token = this.jwtService.sign({ sub: existingFarmer.id, phone: existingFarmer.phone });
      return {
        success: true,
        user: existingFarmer,
        token,
        isNewUser: false,
      };
    }

    return {
      success: true,
      isNewUser: true,
      message: 'New user - proceed to registration',
    };
  }

  async register(registerFarmerDto: RegisterFarmerDto): Promise<{
    success: boolean;
    user: Farmer;
    token: string;
  }> {
    const { phone, name, county, idDocument } = registerFarmerDto;

    // Check if farmer already exists
    const existingFarmer = await this.farmerRepository.findOne({
      where: { phone }
    });

    if (existingFarmer) {
      throw new ConflictException('Farmer with this phone number already exists');
    }

    // Create new farmer
    const farmer = this.farmerRepository.create({
      id: uuidv4(),
      name,
      phone,
      county,
      idDocument,
      joinDate: new Date(),
    });

    const savedFarmer = await this.farmerRepository.save(farmer);

    // Generate JWT token
    const token = this.jwtService.sign({ sub: savedFarmer.id, phone: savedFarmer.phone });

    return {
      success: true,
      user: savedFarmer,
      token,
    };
  }

  async getCurrentUser(userId: string): Promise<Farmer> {
    const farmer = await this.farmerRepository.findOne({
      where: { id: userId }
    });

    if (!farmer) {
      throw new UnauthorizedException('User not found');
    }

    return farmer;
  }
}