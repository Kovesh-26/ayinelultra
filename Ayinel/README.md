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

## Dev Quickstart

### 1) Requirements

- Node 18+ (you have Node 22)
- pnpm
- PostgreSQL running locally (port 5432)
- (Optional) Redis 6379

### 2) Env

- Copy `env.api.example` to `env.local` and update database credentials
- Copy `env.web.example` to `apps/web/.env.local` if needed
- Ensure `DATABASE_URL` and `SHADOW_DATABASE_URL` are valid

### 3) DB migrate

```bash
# If shadow DB missing, run in PowerShell:
# psql -U postgres -h localhost -c "CREATE DATABASE ayineldb_shadow OWNER ayinelusers;"
pnpm -C apps/api db:migrate
pnpm -C apps/api db:generate
```

### 4) Run

```bash
pnpm -C apps/api dev    # API on port 3001
pnpm -C apps/web dev    # Web on port 3002
```

### 5) Health

- API: http://localhost:3001/health
- Web: http://localhost:3002/

### Notes

- **Never use `npx prisma`**; it may install Prisma 6.x and break your pinned 5.22.0
- CORS supports both http://localhost:3000 and http://localhost:3002 by default via `CORS_ORIGINS`
- Set `USE_QUEUES=true` to enable Redis/Bull queues

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

## Development

### Package Scripts

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all packages
- `pnpm -C apps/api db:migrate` - Run database migrations
- `pnpm -C apps/api db:studio` - Open Prisma Studio
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

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@localhost:5432/ayineldb_prod
CORS_ORIGINS=https://ayinel.com,https://www.ayinel.com
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

MIT License

## Support

For support, email support@ayinel.com or join our Discord.
