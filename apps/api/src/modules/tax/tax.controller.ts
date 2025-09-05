import { Controller, Get } from '@nestjs/common';

@Controller('tax')
export class TaxController {
  @Get()
  ping() {
    return { ok: true };
  }
}
