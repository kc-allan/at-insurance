import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Farmer } from './farmer.entity';
import { Policy } from './policy.entity';
import { ClaimImage } from './claim-image.entity';

export enum ClaimReason {
  DROUGHT = 'drought',
  LIVESTOCK_DEATH = 'livestock_death',
  FLOOD = 'flood',
  PEST = 'pest',
  DISEASE = 'disease',
  OTHER = 'other'
}

export enum ClaimStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid'
}

@Entity('claims')
export class Claim {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  policyId: string;

  @Column({ type: 'uuid' })
  farmerId: string;

  @Column({ type: 'varchar', length: 30 })
  reason: ClaimReason;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'real', default: 0 })
  amount: number;

  @Column({ type: 'varchar', length: 20, default: ClaimStatus.PENDING })
  status: ClaimStatus;

  @Column({ type: 'date' })
  dateSubmitted: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Policy, policy => policy.claims)
  @JoinColumn({ name: 'policyId' })
  policy: Policy;

  @ManyToOne(() => Farmer, farmer => farmer.claims)
  @JoinColumn({ name: 'farmerId' })
  farmer: Farmer;

  @OneToMany(() => ClaimImage, claimImage => claimImage.claim)
  images: ClaimImage[];
}