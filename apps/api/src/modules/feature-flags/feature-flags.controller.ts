import { Controller, Get } from '@nestjs/common';

@Controller('feature-flags')
export class FeatureFlagsController {
  @Get()
  ping() {
    return { ok: true };
  }
}
