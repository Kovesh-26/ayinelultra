import { Controller, Get } from '@nestjs/common';

@Controller('appeals')
export class AppealsController {
  @Get()
  ping() {
    return { ok: true };
  }
}
