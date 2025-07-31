import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Policy } from './policy.entity';
import { Claim } from './claim.entity';

@Entity('farmers')
export class Farmer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 100 })
  county: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  idDocument: string;

  @Column({ type: 'date' })
  joinDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Policy, policy => policy.farmer)
  policies: Policy[];

  @OneToMany(() => Claim, claim => claim.farmer)
  claims: Claim[];
}