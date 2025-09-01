import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/v1/health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getHealth() {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'unknown',
        redis: 'unknown',
        externalServices: 'unknown'
      }
    };

    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;
      health.services.database = 'healthy';
    } catch (error) {
      health.services.database = 'unhealthy';
      health.status = 'degraded';
    }

    // TODO: Check Redis connection
    health.services.redis = 'unknown';

    // TODO: Check external services
    health.services.externalServices = 'unknown';

    return health;
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
