# AYINEL Platform Setup Guide

## 🚀 Quick Start

Welcome to AYINEL - the next-gen creator platform! This guide will help you set up the complete platform on your Windows machine.

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v15 or higher) - Already installed ✅
- **pnpm** (v8 or higher) - Already installed ✅
- **pgAdmin4** - For database management

## 🗄️ Database Setup

### Option 1: Using pgAdmin4 (Recommended)

1. **Open pgAdmin4**
2. **Connect to your PostgreSQL server** (usually localhost:5432)
3. **Open Query Tool** (Tools → Query Tool)
4. **Run the setup script**:
   - Open `scripts/setup-database-pgadmin.sql`
   - Copy and paste the content into Query Tool
   - Execute the script (F5 or click Execute)

### Option 2: Using Command Line

If you prefer command line, add PostgreSQL to your PATH and run:

```bash
# Add to PATH: C:\Program Files\PostgreSQL\17\bin
psql -U postgres -f scripts/setup-database-pgadmin.sql
```

## 🔧 Platform Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Database

```bash
# Generate Prisma client
pnpm --filter @ayinel/api db:generate

# Run database migrations
pnpm --filter @ayinel/api db:migrate

# Seed the database with sample data
pnpm --filter @ayinel/api db:seed
```

### 3. Start Development Servers

```bash
# Start all services (API + Web)
pnpm dev

# Or start individually:
pnpm dev:api    # API server (port 3001)
pnpm dev:web    # Web app (port 3000)
```

## 🌐 Access Your Platform

Once everything is running:

- **Web App**: http://localhost:3000
- **API Server**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **pgAdmin4**: http://localhost:5050 (if running)

## 📁 Project Structure

```
AYINEL/
├── apps/
│   ├── api/          # NestJS backend
│   ├── web/          # Next.js frontend
│   └── mobile/       # React Native app (coming soon)
├── packages/
│   ├── types/        # Shared TypeScript types
│   └── ui/           # Shared UI components (coming soon)
├── scripts/          # Setup and utility scripts
└── docs/             # Documentation
```

## 🎯 Key Features

### ✅ Implemented

- **Monorepo Structure** with pnpm workspaces
- **Database Schema** with Prisma ORM
- **Type System** with comprehensive TypeScript types
- **API Foundation** with NestJS
- **Web Foundation** with Next.js 14
- **Authentication** system ready
- **File Upload** infrastructure
- **Real-time** messaging with Socket.IO
- **Payment Processing** with Stripe
- **AI Integration** ready
- **KidZone** safety features
- **Theme Customization** system

### 🚧 In Progress

- **Core API Modules** (Auth, Users, Studios, Videos, etc.)
- **Web Components** and pages
- **Mobile App** development
- **Advanced Features** (Live streaming, AI tools)

## 🔧 Development Commands

```bash
# Database
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio

# Development
pnpm dev              # Start all services
pnpm dev:api          # Start API only
pnpm dev:web          # Start web only
pnpm dev:mobile       # Start mobile (coming soon)

# Building
pnpm build            # Build all packages
pnpm build:api        # Build API
pnpm build:web        # Build web app

# Utilities
pnpm routes:scaffold  # Generate web routes
pnpm setup            # Complete setup
```

## 🛠️ Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL service is running
- Check credentials in `apps/api/.env`
- Verify database exists: `ayinel_db`
- Verify user exists: `ayineluser` with password `ayinelpass`

### Port Conflicts

- API runs on port 3001
- Web runs on port 3000
- Change ports in respective `.env` files if needed

### Build Issues

- Clear node_modules: `rm -rf node_modules && pnpm install`
- Regenerate Prisma: `pnpm --filter @ayinel/api db:generate`
- Check TypeScript errors: `pnpm --filter @ayinel/types build`

## 🎨 Brand Guidelines

AYINEL uses specific terminology throughout the platform:

- **Channel** → **Studio**
- **Subscribe** → **Join**
- **Follow** → **Tune-In**
- **Like** → **Boost**
- **Comment** → **Chat**
- **Playlist** → **Collection**
- **Shorts** → **Flips**
- **Live** → **Broadcast**
- **Subscribers/Members** → **Crew**
- **Recommendations** → **For You**

## 🔐 Environment Variables

Key environment variables are configured in `env.local`:

- **Database**: PostgreSQL connection
- **JWT**: Authentication tokens
- **OAuth**: Google/Apple login
- **Stripe**: Payment processing
- **S3/R2**: File storage
- **Mux/Cloudflare**: Video streaming
- **AI**: OpenAI integration
- **Email**: SendGrid/Mailgun

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs in the terminal
3. Check the API documentation at http://localhost:3001/api/docs
4. Verify database setup in pgAdmin4

## 🎉 Next Steps

Once the platform is running:

1. **Explore the API** at http://localhost:3001/api/docs
2. **Visit the web app** at http://localhost:3000
3. **Check the database** in pgAdmin4
4. **Start building features** in the codebase

Welcome to AYINEL! 🚀
