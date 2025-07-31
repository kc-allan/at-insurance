import { Controller, Get, Post, Param, Body, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Claims')
@Controller('claims')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Get()
  @ApiOperation({ summary: 'Get claims for current farmer' })
  async findByFarmer(@Request() req) {
    return this.claimsService.findByFarmer(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get claim by ID' })
  async findOne(@Param('id') id: string) {
    return this.claimsService.findOne(id);
  }

  @Get('by-policy/:policyId')
  @ApiOperation({ summary: 'Get claims for specific policy' })
  async findByPolicy(@Param('policyId') policyId: string) {
    return this.claimsService.findByPolicy(policyId);
  }

  @Post()
  @ApiOperation({ summary: 'Submit new claim' })
  @UseInterceptors(FilesInterceptor('images', 5, {
    storage: diskStorage({
      destination: './uploads/claim_images',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  }))
  async create(
    @Request() req,
    @Body() createClaimDto: CreateClaimDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    const claim = await this.claimsService.create(req.user.userId, createClaimDto);
    
    // Add images if provided
    if (files && files.length > 0) {
      const imagePaths = files.map(file => `uploads/claim_images/${file.filename}`);
      await this.claimsService.addImages(claim.id, imagePaths);
    }

    return { 
      success: true, 
      data: claim,
      message: 'Claim submitted successfully. We will contact you shortly.' 
    };
  }
}