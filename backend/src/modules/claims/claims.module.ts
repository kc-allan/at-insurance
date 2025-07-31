import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';
import { Claim } from '../../entities/claim.entity';
import { ClaimImage } from '../../entities/claim-image.entity';
import { Policy } from '../../entities/policy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Claim, ClaimImage, Policy])],
  controllers: [ClaimsController],
  providers: [ClaimsService],
  exports: [ClaimsService],
})
export class ClaimsModule {}