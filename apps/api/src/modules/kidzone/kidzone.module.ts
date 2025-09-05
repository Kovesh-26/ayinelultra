import { Module } from '@nestjs/common';
import { KidzoneController } from './kidzone.controller';
import { KidzoneService } from './kidzone.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KidzoneController],
  providers: [KidzoneService],
  exports: [KidzoneService],
})
export class KidzoneModule {}
