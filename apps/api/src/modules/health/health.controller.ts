import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Controller('api/v1/health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getHealth(@Res() res: Response) {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'unknown',
        redis: 'unknown',
        stripe: 'unknown',
        s3: 'unknown'
      }
    };

    let overallHealthy = true;

    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;
      health.services.database = 'healthy';
    } catch (error) {
      health.services.database = 'unhealthy';
      overallHealthy = false;
    }

    // Check Redis connection if configured
    try {
      const redisUrl = this.configService.get('REDIS_URL');
      if (redisUrl) {
        // Import Redis dynamically to avoid errors if not configured
        const { createClient } = await import('redis');
        const redisClient = createClient({ url: redisUrl });
        await redisClient.connect();
        await redisClient.ping();
        await redisClient.quit();
        health.services.redis = 'healthy';
      } else {
        health.services.redis = 'not_configured';
      }
    } catch (error) {
      health.services.redis = 'unhealthy';
      overallHealthy = false;
    }

    // Check Stripe if configured
    try {
      const stripeKey = this.configService.get('STRIPE_SECRET_KEY');
      if (stripeKey) {
        // Basic validation - just check if key is present
        health.services.stripe = stripeKey.startsWith('sk_') ? 'configured' : 'invalid_key';
      } else {
        health.services.stripe = 'not_configured';
      }
    } catch (error) {
      health.services.stripe = 'error';
    }

    // Check S3 if configured
    try {
      const s3Bucket = this.configService.get('S3_BUCKET_NAME');
      const s3Region = this.configService.get('S3_REGION');
      if (s3Bucket && s3Region) {
        health.services.s3 = 'configured';
      } else {
        health.services.s3 = 'not_configured';
      }
    } catch (error) {
      health.services.s3 = 'error';
    }

    if (!overallHealthy) {
      health.status = 'degraded';
    }

    const statusCode = overallHealthy ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
    return res.status(statusCode).json(health);
  }

  @Get('ready')
  async getReadiness() {
    try {
      // Check if the application is ready to serve traffic
      await this.prisma.$queryRaw`SELECT 1`;
      
      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
        message: 'Application is ready to serve traffic'
      };
    } catch (error) {
      return {
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        message: 'Application is not ready to serve traffic',
        error: error.message
      };
    }
  }

  @Get('live')
  async getLiveness() {
    // Simple liveness check - if this endpoint responds, the app is alive
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      message: 'Application is alive and running'
    };
  }
}
