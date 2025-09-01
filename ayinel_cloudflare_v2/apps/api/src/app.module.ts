import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';

// Feature modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { StudiosModule } from './studios/studios.module';
import { VideosModule } from './videos/videos.module';
import { CollectionsModule } from './collections/collections.module';
import { ChatModule } from './chat/chat.module';
import { AiModule } from './ai/ai.module';
import { ConsoleModule } from './console/console.module';
import { VideoEditorModule } from './video-editor/video-editor.module';
import { CallsModule } from './calls/calls.module';
import { StoreModule } from './store/store.module';
import { TuneInModule } from './social/tune-in.module';
import { BoostModule } from './social/boost.module';
import { VideoChatModule } from './social/video-chat.module';
import { NotificationsModule } from './social/notifications.module';
import { WalletModule } from './wallet/wallet.module';
import { AdminModule } from './admin/admin.module';
import { KidZoneModule } from './kidzone/kidzone.module';
import { UploadsModule } from './uploads/uploads.module';

import { AnalyticsModule } from './analytics/analytics.module';

// Database
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Scheduling
    ScheduleModule.forRoot(),

    // Event emitter
    EventEmitterModule.forRoot(),

    // Queue system
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),

    // Database
    PrismaModule,

    // Feature modules
    AuthModule,
    UsersModule,
    ProfilesModule,
    StudiosModule,
    VideosModule,
    CollectionsModule,
    ChatModule,
    AiModule,
    ConsoleModule,
    VideoEditorModule,
    CallsModule,
    StoreModule,
    TuneInModule,
    BoostModule,
    VideoChatModule,
    NotificationsModule,
    WalletModule,
    AdminModule,
    KidZoneModule,
    UploadsModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
