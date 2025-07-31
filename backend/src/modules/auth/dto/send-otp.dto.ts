import { IsString, IsPhoneNumber, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({
    description: 'Kenyan phone number in international format',
    example: '+254712345678'
  })
  @IsString()
  @Matches(/^\+254[17]\d{8}$/, {
    message: 'Phone number must be a valid Kenyan number (+254XXXXXXXXX)'
  })
  phone: string;
}