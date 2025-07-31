import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { FarmersService } from './farmers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Farmers')
@Controller('farmers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FarmersController {
  constructor(private readonly farmersService: FarmersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all farmers' })
  async findAll() {
    return this.farmersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get farmer by ID' })
  async findOne(@Param('id') id: string) {
    return this.farmersService.findOne(id);
  }
}