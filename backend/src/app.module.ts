import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

// Core modules
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';

// Feature modules
import { AuthModule } from './auth/auth.module';
import { NonprofitsModule } from './nonprofits/nonprofits.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { DonationsModule } from './donations/donations.module';
import { VolunteeringModule } from './volunteering/volunteering.module';
import { EventsModule } from './events/events.module';
import { PetitionsModule } from './petitions/petitions.module';
import { ImpactModule } from './impact/impact.module';
import { ForumsModule } from './forums/forums.module';
import { CommunicationsModule } from './communications/communications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AdminModule } from './admin/admin.module';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // Rate limiting
        ThrottlerModule.forRoot([{
            ttl: parseInt(process.env.RATE_LIMIT_TTL) || 60,
            limit: parseInt(process.env.RATE_LIMIT_MAX) || 100,
        }]),

        // Schedule
        ScheduleModule.forRoot(),

        // Events
        EventEmitterModule.forRoot(),

        // Bull queue
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT) || 6379,
                password: process.env.REDIS_PASSWORD,
            },
        }),

        // Core modules
        PrismaModule,
        RedisModule,

        // Feature modules
        AuthModule,
        NonprofitsModule,
        CampaignsModule,
        DonationsModule,
        VolunteeringModule,
        EventsModule,
        PetitionsModule,
        ImpactModule,
        ForumsModule,
        CommunicationsModule,
        AnalyticsModule,
        AdminModule,
    ],
})
export class AppModule { }
