import { Module } from '@nestjs/common';
import { NonprofitsService } from './nonprofits.service';
import { NonprofitsController } from './nonprofits.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [NonprofitsController],
    providers: [NonprofitsService],
    exports: [NonprofitsService],
})
export class NonprofitsModule { }
