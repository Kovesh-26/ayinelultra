import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RateLimitService } from './rate-limit.service';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  constructor(private readonly _rateLimitService: RateLimitService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Get client identifier (IP address in this case)
    const clientId = request.ip || request.connection.remoteAddress || 'unknown';

    // Rate limit configuration
    const config = {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100, // 100 requests per window
    };

    // Check rate limit
    const rateLimitInfo = this._rateLimitService.checkRateLimit(clientId, config);

    // Set rate limit headers
    response.setHeader('X-RateLimit-Limit', rateLimitInfo.limit);
    response.setHeader('X-RateLimit-Remaining', rateLimitInfo.remaining);
    response.setHeader('X-RateLimit-Reset', rateLimitInfo.reset.toISOString());

    if (rateLimitInfo.retryAfter !== undefined) {
      response.setHeader('Retry-After', rateLimitInfo.retryAfter);
      return false; // Rate limited
    }

    return true; // Allow request
  }
}