import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Farmer } from './farmer.entity';
import { Claim } from './claim.entity';

export enum PolicyType {
  CROP = 'crop',
  LIVESTOCK = 'livestock'
}

export enum PolicyStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PENDING = 'pending'
}

@Entity('policies')
export class Policy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  farmerId: string;

  @Column({ type: 'varchar', length: 20 })
  type: PolicyType;

  @Column({ type: 'varchar', length: 255 })
  product: string;

  @Column({ type: 'varchar', length: 255 })
  coverage: string;

  @Column({ type: 'real' })
  premium: number;

  @Column({ type: 'varchar', length: 20, default: PolicyStatus.PENDING })
  status: PolicyStatus;

  @Column({ type: 'date' })
  validFrom: Date;

  @Column({ type: 'date' })
  validTo: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Farmer, farmer => farmer.policies)
  @JoinColumn({ name: 'farmerId' })
  farmer: Farmer;

  @OneToMany(() => Claim, claim => claim.policy)
  claims: Claim[];
}