# AYINEL FIX PACK 1

## Goal

Fix remaining blockers and polish the MVP for production readiness:

1. Apply pending Prisma migrations safely
2. Fix CORS configuration for proper frontend-backend communication
3. Create environment samples for deployment
4. Make Redis optional for development
5. Update README with proper setup instructions
6. Resolve OneDrive EPERM issues

## Instructions for Cursor

Please implement these fixes in order:

### 1. CORS Configuration Fix

Update `apps/api/src/main.ts` to support both development ports:

```typescript
// Update the CORS configuration to support both 3000 and 3002
app.enableCors({
  origin: (configService.get('CORS_ORIGIN') as string)?.split(',') || [
    'http://localhost:3000',
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3002',
    'https://ayinel.com',
    'https://www.ayinel.com',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
});
```

### 2. Environment Configuration

Create `env.example` at repo root:

```env
# Ayinel Platform Environment Configuration

# Application
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/ayineldb?schema=public
SHADOW_DATABASE_URL=postgresql://username:password@localhost:5432/ayineldb_shadow?schema=public

# Redis Configuration (Optional - only needed for background jobs)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_URL=redis://127.0.0.1:6379

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_ACCESS_EXPIRES=900
JWT_REFRESH_EXPIRES=2592000

# API Configuration
PORT=3001
CORS_ORIGIN=http://localhost:3000,http://localhost:3002

# Media Storage
MEDIA_ROOT=./uploads
PUBLIC_MEDIA_BASE_URL=http://localhost:3001/uploads

# Payment Integration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Frontend Configuration
NEXT_PUBLIC_API_BASE=http://localhost:3001
```

### 3. Make Redis Optional

Update `apps/api/src/app.module.ts` to make Redis optional:

```typescript
// Make QueueModule optional by wrapping in conditional import
const queueModule = process.env.REDIS_URL ? QueueModule : undefined;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    StudiosModule,
    MediaModule,
    VideosModule,
    CollectionsModule,
    ChatModule,
    FeedModule,
    PaymentsModule,
    // Conditionally include QueueModule only if Redis is configured
    ...(queueModule ? [queueModule] : []),
  ].filter(Boolean),
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 4. Update Videos Service

Update `apps/api/src/videos/videos.service.ts` to handle optional queue service:

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  Optional,
} from '@nestjs/common';

@Injectable()
export class VideosService {
  constructor(
    private prisma: PrismaService,
    @Optional() @Inject('QueueService') private queueService?: any
  ) {}

  // Update the upload method to handle optional queue
  async uploadVideoFile(
    videoId: string,
    file: Express.Multer.File
  ): Promise<Media> {
    // ... existing code ...

    // Only enqueue transcode job if queue service is available
    if (this.queueService) {
      await this.queueService.addTranscodeJob({
        videoId,
        inputPath: media.filePath,
        outputDir: path.dirname(media.filePath),
      });
    } else {
      console.log(
        'Queue service not available - skipping background transcoding'
      );
    }

    return media;
  }
}
```

### 5. Update README

Create/update `README.md`:

````markdown
# Ayinel Platform

Next-generation video platform for creators built with modern technologies.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Queue**: BullMQ + Redis (optional for development)
- **Auth**: JWT + bcryptjs
- **Payments**: Stripe
- **Deployment**: Docker-ready

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+
- Redis (optional, for background jobs)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd ayinel
   pnpm install
   ```
````

2. **Setup environment:**

   ```bash
   cp env.example env.local
   # Edit env.local with your database credentials
   ```

3. **Setup database:**

   ```bash
   # Create databases
   psql -U postgres -h localhost -c "CREATE DATABASE ayineldb OWNER yourusername;"
   psql -U postgres -h localhost -c "CREATE DATABASE ayineldb_shadow OWNER yourusername;"

   # Run migrations
   pnpm -C apps/api db:migrate
   pnpm -C apps/api db:generate
   ```

4. **Start development servers:**

   ```bash
   # Start both API and Web servers
   pnpm dev

   # Or start individually:
   pnpm dev:api    # API on http://localhost:3001
   pnpm dev:web    # Web on http://localhost:3002
   ```

### Development URLs

- **Web App**: http://localhost:3002
- **API**: http://localhost:3001
- **API Health**: http://localhost:3001/health
- **Database Studio**: `pnpm db:studio`

## Features

### MVP Features ✅

- User authentication (signup/login with email or username)
- Studio creation (automatic for new users)
- Public Studio pages with branding
- Creator dashboard and settings
- Studio branding management (logo, banner, about)
- Video upload and management
- Real-time chat
- Payment integration (Stripe)

### Coming Soon 🚧

- Store management (products)
- Analytics dashboard
- Live streaming
- Advanced creator tools

## API Endpoints

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login (email or username)
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

### Studios

- `GET /studios/:handle` - Get public studio data
- `PUT /studios/:handle/branding` - Update studio branding
- `GET /studios/:handle/analytics` - Get studio analytics
- `GET /studios/:handle/products` - Get studio products
- `POST /studios/:handle/products` - Create studio product

### Media

- `POST /media/upload` - Upload media file
- `GET /media/:id` - Get media details
- `POST /media/:id/boost` - Boost media (like)
- `POST /media/:id/comment` - Add comment

## Database Schema

Key models:

- **User** - User accounts and profiles
- **Studio** - Creator studios/channels
- **Media** - Videos, audio, and other content
- **Product** - Studio store items
- **StudioAnalytics** - Studio performance metrics

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@localhost:5432/ayineldb_prod
CORS_ORIGIN=https://ayinel.com,https://www.ayinel.com
NEXT_PUBLIC_API_BASE=https://api.ayinel.com
```

### Docker Deployment

```bash
# Start services
docker-compose -f docker-compose.dev.yml up -d

# Build and deploy
pnpm build
pnpm start:prod
```

## Development

### Package Scripts

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all packages
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Prisma Studio
- `pnpm lint` - Lint all packages

### Project Structure

```
apps/
  api/          # NestJS backend
  web/          # Next.js frontend
packages/
  types/        # Shared TypeScript types
  ui/           # Shared React components
```

## Troubleshooting

### Common Issues

**OneDrive EPERM Errors:**

```bash
# Move project out of OneDrive or exclude folder from sync
# Then reinstall dependencies
pnpm install
```

**Prisma Client Issues:**

```bash
pnpm -C apps/api db:generate
```

**Port Conflicts:**

```bash
# Kill existing processes
taskkill /f /im node.exe
# Or change ports in package.json
```

**Migration Issues:**

```bash
# Reset migrations (development only)
pnpm -C apps/api db:push
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

[Your License]

## Support

For support, email support@ayinel.com or join our Discord.

````

### 6. Prisma Migration Instructions

After implementing the above changes, run these commands in PowerShell:

```bash
# Create shadow database if it doesn't exist
psql -U postgres -h localhost -c "CREATE DATABASE ayineldb_shadow OWNER ayinelusers;"

# Apply pending migrations
pnpm -C apps/api db:migrate

# Regenerate Prisma client
pnpm -C apps/api db:generate
````

### 7. Verification Steps

After all changes:

1. **Test API Health:**

   ```bash
   curl http://localhost:3001/health
   ```

2. **Test Studio Endpoint:**

   ```bash
   curl http://localhost:3001/studios/alyahshad
   ```

3. **Test Frontend:**
   Open http://localhost:3002 in browser

4. **Test Authentication Flow:**
   - Go to http://localhost:3002/login
   - Login with: alyahshad@gmail.com / password123
   - Should redirect to dashboard

## Post-Implementation Checklist

- [ ] API server starts without errors on port 3001
- [ ] Web server starts without errors on port 3002
- [ ] CORS allows requests from both 3000 and 3002
- [ ] Prisma migrations applied successfully
- [ ] Studio endpoint returns data
- [ ] Authentication flow works end-to-end
- [ ] OneDrive EPERM issues resolved (if applicable)
- [ ] README accurately reflects current setup

## Notes

- Redis is now optional - platform works without it for development
- CORS configured for both possible frontend ports
- Environment samples provided for easy deployment
- All pending migrations will be applied safely
- No data loss expected from any of these changes

Ready to paste into Cursor for automatic implementation!
