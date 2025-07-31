import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PoliciesController } from './policies.controller';
import { PoliciesService } from './policies.service';
import { Policy } from '../../entities/policy.entity';
import { Farmer } from '../../entities/farmer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Policy, Farmer])],
  controllers: [PoliciesController],
  providers: [PoliciesService],
  exports: [PoliciesService],
})
export class PoliciesModule {}