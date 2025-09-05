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
import { KidzoneModule } from './modules/kidzone/kidzone.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { ChatModule } from './modules/chat/chat.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { StoreModule } from './modules/store/store.module';
import { PayoutsModule } from './modules/payouts/payouts.module';
import { TaxModule } from './modules/tax/tax.module';
import { FeatureFlagsModule } from './modules/feature-flags/feature-flags.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AppealsModule } from './modules/appeals/appeals.module';
import { HealthModule } from './modules/health/health.module';
import { RateLimitModule } from './modules/rate-limit/rate-limit.module';
import { SecurityModule } from './modules/security/security.module';
import { KidzoneComplianceModule } from './modules/kidzone-compliance/kidzone-compliance.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';

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
    KidzoneModule,
    CollectionsModule,
    ChatModule,
    WebhooksModule,
    StoreModule,
    PayoutsModule,
    TaxModule,
    FeatureFlagsModule,
    ReportsModule,
    AppealsModule,
    HealthModule,
    RateLimitModule,
    SecurityModule,
    KidzoneComplianceModule,
    MonitoringModule,
  ],
})
export class AppModule {}
