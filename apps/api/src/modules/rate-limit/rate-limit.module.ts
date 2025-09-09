import { Module } from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';
import { CustomThrottlerGuard } from './rate-limit.guard';

@Module({
  providers: [RateLimitService, CustomThrottlerGuard],
  exports: [RateLimitService, CustomThrottlerGuard],
})
export class RateLimitModule {}