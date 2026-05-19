import { Module } from '@nestjs/common';
import { PetitionsService } from './petitions.service';
import { PetitionsController } from './petitions.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PetitionsController],
    providers: [PetitionsService],
    exports: [PetitionsService],
})
export class PetitionsModule { }
