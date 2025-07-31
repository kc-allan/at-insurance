import { IsEnum, IsString, IsNumber, IsPositive, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PolicyType } from '../../../entities/policy.entity';

export class CreatePolicyDto {
  @ApiProperty({
    description: 'Type of insurance policy',
    enum: PolicyType
  })
  @IsEnum(PolicyType)
  type: PolicyType;

  @ApiProperty({
    description: 'Product being insured',
    example: 'Maize'
  })
  @IsString()
  @Length(1, 255)
  product: string;

  @ApiProperty({
    description: 'Coverage amount (acres for crops, number for livestock)',
    example: 5
  })
  @IsNumber()
  @IsPositive()
  coverage: number;

  @ApiProperty({
    description: 'Location/county',
    example: 'Nakuru'
  })
  @IsString()
  @Length(1, 100)
  location: string;
}