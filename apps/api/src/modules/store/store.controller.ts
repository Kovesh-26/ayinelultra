import { Controller, Get } from '@nestjs/common';

@Controller('store')
export class StoreController {
  @Get()
  ping() {
    return { ok: true };
  }
}
