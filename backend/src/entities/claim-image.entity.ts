import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Claim } from './claim.entity';

@Entity('claim_images')
export class ClaimImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  claimId: string;

  @Column({ type: 'varchar', length: 500 })
  imagePath: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Claim, claim => claim.images)
  @JoinColumn({ name: 'claimId' })
  claim: Claim;
}