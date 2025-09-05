import { Module } from '@nestjs/common';
import { TaxController } from './tax.controller';
import { TaxService } from './tax.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TaxController],
  providers: [TaxService],
  exports: [TaxService],
})
export class TaxModule {}
