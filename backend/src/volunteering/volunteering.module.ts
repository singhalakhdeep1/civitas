import { Module } from '@nestjs/common';
import { VolunteeringService } from './volunteering.service';
import { VolunteeringController } from './volunteering.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [VolunteeringController],
    providers: [VolunteeringService],
    exports: [VolunteeringService],
})
export class VolunteeringModule { }
