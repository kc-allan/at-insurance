import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Policies')
@Controller('policies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Get()
  @ApiOperation({ summary: 'Get policies for current farmer' })
  async findByFarmer(@Request() req) {
    return this.policiesService.findByFarmer(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get policy by ID' })
  async findOne(@Param('id') id: string) {
    return this.policiesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new policy' })
  async create(@Request() req, @Body() createPolicyDto: CreatePolicyDto) {
    return this.policiesService.create(req.user.userId, createPolicyDto);
  }

  @Post(':id/renew')
  @ApiOperation({ summary: 'Renew existing policy' })
  async renew(@Param('id') id: string) {
    return this.policiesService.renewPolicy(id);
  }

  @Post('calculate-premium')
  @ApiOperation({ summary: 'Calculate premium for policy data' })
  async calculatePremium(@Body() dto: { type: string; coverage: number }) {
    const premium = this.policiesService.calculatePremium(dto.type as any, dto.coverage);
    return { premium };
  }
}