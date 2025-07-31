import { IsString, IsPhoneNumber, Matches, Length, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterFarmerDto {
  @ApiProperty({
    description: 'Full name of the farmer',
    example: 'John Mwangi'
  })
  @IsString()
  @Length(2, 255, { message: 'Name must be between 2 and 255 characters' })
  name: string;

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
    description: 'County where the farmer is located',
    example: 'Nakuru'
  })
  @IsString()
  @Length(2, 100, { message: 'County must be between 2 and 100 characters' })
  county: string;

  @ApiPropertyOptional({
    description: 'Path to uploaded ID document',
    example: 'uploads/id_documents/farmer123/national_id.jpg'
  })
  @IsOptional()
  @IsString()
  idDocument?: string;
}