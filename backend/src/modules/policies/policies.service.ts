import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Policy, PolicyType, PolicyStatus } from '../../entities/policy.entity';
import { Farmer } from '../../entities/farmer.entity';
import { CreatePolicyDto } from './dto/create-policy.dto';

@Injectable()
export class PoliciesService {
  constructor(
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
    @InjectRepository(Farmer)
    private farmerRepository: Repository<Farmer>,
  ) {}

  async findByFarmer(farmerId: string): Promise<Policy[]> {
    return this.policyRepository.find({
      where: { farmerId },
      relations: ['farmer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Policy> {
    const policy = await this.policyRepository.findOne({
      where: { id },
      relations: ['farmer', 'claims'],
    });

    if (!policy) {
      throw new NotFoundException('Policy not found');
    }

    return policy;
  }

  async create(farmerId: string, createPolicyDto: CreatePolicyDto): Promise<Policy> {
    const farmer = await this.farmerRepository.findOne({ where: { id: farmerId } });
    if (!farmer) {
      throw new NotFoundException('Farmer not found');
    }

    // Calculate premium
    const premium = this.calculatePremium(createPolicyDto.type, createPolicyDto.coverage);

    // Create policy
    const policy = this.policyRepository.create({
      id: uuidv4(),
      farmerId,
      type: createPolicyDto.type,
      product: createPolicyDto.product,
      coverage: `${createPolicyDto.coverage} ${createPolicyDto.type === PolicyType.CROP ? 'acres' : 'animals'}`,
      premium,
      status: PolicyStatus.ACTIVE,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
    });

    return this.policyRepository.save(policy);
  }

  async renewPolicy(policyId: string): Promise<Policy> {
    const existingPolicy = await this.findOne(policyId);
    
    const renewedPolicy = this.policyRepository.create({
      id: uuidv4(),
      farmerId: existingPolicy.farmerId,
      type: existingPolicy.type,
      product: existingPolicy.product,
      coverage: existingPolicy.coverage,
      premium: existingPolicy.premium,
      status: PolicyStatus.ACTIVE,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });

    return this.policyRepository.save(renewedPolicy);
  }

  calculatePremium(type: PolicyType, coverage: number): number {
    const baseRates = {
      [PolicyType.CROP]: 500, // KES 500 per acre
      [PolicyType.LIVESTOCK]: 600, // KES 600 per animal
    };

    return coverage * baseRates[type];
  }
}