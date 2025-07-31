import { IsString, IsPhoneNumber, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Kenyan phone number in international format',
    example: '+254712345678'
  })
  @IsString()
  @Matches(/^\+254[17]\d{8}$/, {
    message: 'Phone number must be a valid Kenyan number (+254XXXXXXXXX)'
  })
  phone: string;

  @ApiProperty({
    description: '6-digit OTP code',
    example: '123456'
  })
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'OTP must contain only digits' })
  otp: string;
}