import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            name: 'short',
            ttl: parseInt(configService.get('RATE_LIMIT_TTL', '60000')), // 1 minute default
            limit: parseInt(configService.get('RATE_LIMIT_LIMIT', '10')), // 10 requests default
          },
          {
            name: 'medium',
            ttl: parseInt(configService.get('RATE_LIMIT_TTL_MEDIUM', '600000')), // 10 minutes default
            limit: parseInt(configService.get('RATE_LIMIT_LIMIT_MEDIUM', '100')), // 100 requests default
          },
          {
            name: 'long',
            ttl: parseInt(configService.get('RATE_LIMIT_TTL_LONG', '3600000')), // 1 hour default
            limit: parseInt(configService.get('RATE_LIMIT_LIMIT_LONG', '1000')), // 1000 requests default
          },
        ],
      }),
    }),
  ],
  exports: [ThrottlerModule],
})
export class RateLimitModule {}