import { Module } from '@nestjs/common';
import { TuneInController } from './tune-in.controller';
import { TuneInService } from './tune-in.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TuneInController],
  providers: [TuneInService],
  exports: [TuneInService],
})
export class TuneInModule {}
