import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StudiosModule } from './modules/studios/studios.module';
import { LiveModule } from './modules/live/live.module';
import { MusicModule } from './modules/music/music.module';
import { BillingModule } from './modules/billing/billing.module';
import { AdminModule } from './modules/admin/admin.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    StudiosModule,
    LiveModule,
    MusicModule,
    BillingModule,
    AdminModule,
    MarketplaceModule,
    HealthModule,
  ],
})
export class AppModule {}
