import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CampaignsModule } from '../campaigns/campaigns.module';

@Module({
    imports: [PrismaModule, CampaignsModule],
    controllers: [DonationsController],
    providers: [DonationsService],
    exports: [DonationsService],
})
export class DonationsModule { }
