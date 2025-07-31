import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('otp_sessions')
export class OtpSession {
  @PrimaryColumn({ type: 'varchar', length: 15 })
  phone: string;

  @Column({ type: 'varchar', length: 6 })
  otpCode: string;

  @Column({ type: 'datetime' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}