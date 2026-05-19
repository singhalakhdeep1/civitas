import { Module } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { ForumsController } from './forums.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ForumsController],
    providers: [ForumsService],
    exports: [ForumsService],
})
export class ForumsModule { }
