import { IsEnum, IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ClaimReason } from '../../../entities/claim.entity';

export class CreateClaimDto {
  @ApiProperty({
    description: 'Policy ID for the claim',
    example: 'uuid-string'
  })
  @IsUUID()
  policyId: string;

  @ApiProperty({
    description: 'Reason for the claim',
    enum: ClaimReason
  })
  @IsEnum(ClaimReason)
  reason: ClaimReason;

  @ApiProperty({
    description: 'Detailed description of the claim',
    example: 'Severe drought affected 80% of maize crop'
  })
  @IsString()
  @Length(10, 1000)
  description: string;
}