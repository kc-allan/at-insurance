import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Claim, ClaimStatus } from '../../entities/claim.entity';
import { ClaimImage } from '../../entities/claim-image.entity';
import { Policy } from '../../entities/policy.entity';
import { CreateClaimDto } from './dto/create-claim.dto';

@Injectable()
export class ClaimsService {
  constructor(
    @InjectRepository(Claim)
    private claimRepository: Repository<Claim>,
    @InjectRepository(ClaimImage)
    private claimImageRepository: Repository<ClaimImage>,
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
  ) {}

  async findByFarmer(farmerId: string): Promise<Claim[]> {
    return this.claimRepository.find({
      where: { farmerId },
      relations: ['policy', 'images'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Claim> {
    const claim = await this.claimRepository.findOne({
      where: { id },
      relations: ['policy', 'farmer', 'images'],
    });

    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    return claim;
  }

  async findByPolicy(policyId: string): Promise<Claim[]> {
    return this.claimRepository.find({
      where: { policyId },
      relations: ['images'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(farmerId: string, createClaimDto: CreateClaimDto): Promise<Claim> {
    // Verify policy exists and belongs to farmer
    const policy = await this.policyRepository.findOne({
      where: { id: createClaimDto.policyId, farmerId },
    });

    if (!policy) {
      throw new NotFoundException('Policy not found or does not belong to farmer');
    }

    const claim = this.claimRepository.create({
      id: uuidv4(),
      farmerId,
      policyId: createClaimDto.policyId,
      reason: createClaimDto.reason,
      description: createClaimDto.description,
      amount: 0, // Will be set by admin during review
      status: ClaimStatus.PENDING,
      dateSubmitted: new Date(),
    });

    return this.claimRepository.save(claim);
  }

  async addImages(claimId: string, imagePaths: string[]): Promise<ClaimImage[]> {
    const claim = await this.findOne(claimId);
    
    const claimImages = imagePaths.map(imagePath => 
      this.claimImageRepository.create({
        claimId: claim.id,
        imagePath,
      })
    );

    return this.claimImageRepository.save(claimImages);
  }
}