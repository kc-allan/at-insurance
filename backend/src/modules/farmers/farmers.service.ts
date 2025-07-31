import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Farmer } from '../../entities/farmer.entity';

@Injectable()
export class FarmersService {
  constructor(
    @InjectRepository(Farmer)
    private farmerRepository: Repository<Farmer>,
  ) {}

  async findAll(): Promise<Farmer[]> {
    return this.farmerRepository.find({
      relations: ['policies', 'claims'],
    });
  }

  async findOne(id: string): Promise<Farmer> {
    return this.farmerRepository.findOne({
      where: { id },
      relations: ['policies', 'claims'],
    });
  }

  async update(id: string, updateData: Partial<Farmer>): Promise<Farmer> {
    await this.farmerRepository.update(id, updateData);
    return this.findOne(id);
  }
}