import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { FarmersModule } from './modules/farmers/farmers.module';
import { PoliciesModule } from './modules/policies/policies.module';
import { ClaimsModule } from './modules/claims/claims.module';
import { MpesaModule } from './modules/mpesa/mpesa.module';

// Entities
import { Farmer } from './entities/farmer.entity';
import { Policy } from './entities/policy.entity';
import { Claim } from './entities/claim.entity';
import { ClaimImage } from './entities/claim-image.entity';
import { OtpSession } from './entities/otp-session.entity';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database - Using SQLite for development
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.NODE_ENV === 'production' ? 'africas_insurance.db' : ':memory:', // In-memory for development
      entities: [Farmer, Policy, Claim, ClaimImage, OtpSession],
      synchronize: true, // Auto-create tables
      logging: process.env.NODE_ENV === 'development',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    }]),

    // Static file serving for uploads
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // Feature modules
    AuthModule,
    FarmersModule,
    PoliciesModule,
    ClaimsModule,
    MpesaModule,
  ],
})
export class AppModule {}