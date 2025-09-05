import { Controller, Get } from '@nestjs/common';

@Controller('payouts')
export class PayoutsController {
  @Get()
  ping() {
    return { ok: true };
  }
}
