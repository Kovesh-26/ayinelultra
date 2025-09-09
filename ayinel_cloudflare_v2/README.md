# 🚀 Ayinel v2 - Complete Video Platform

A comprehensive video streaming platform built with Next.js 14, NestJS, and Cloudflare infrastructure.

## 🌟 Features

### Core Platform

- **Users & Profiles**: Customizable profiles with fonts, palettes, wallpapers, music, photo albums
- **Creator Studios**: Full studio management with analytics, uploads, and monetization
- **Video Streaming**: Cloudflare Stream integration with processing and delivery
- **Collections**: Playlist management and organization
- **Social Features**: Friendships, DMs, group chats, and real-time messaging

### Advanced Features

- **KidZone**: Child-safe environment with guardian consent and content filtering
- **Live Calls**: WebRTC-based video calls using LiveKit
- **Token Economy**: Complete token system for tips, boosts, memberships, and store purchases
- **Store System**: Platform and creator stores with token-based transactions
- **Admin Console**: Full moderation suite with user management and analytics

### Monetization

- **Stripe Integration**: Payment processing for tokens and memberships
- **Creator Payouts**: Stripe Connect for creator earnings
- **Multiple Payment Methods**: Stripe, PayPal, and Cash App support
- **Token Packages**: Configurable token bundles with different pricing tiers

## 🏗️ Architecture

```
ayinel_cloudflare_v2/
├── apps/
│   ├── web/                 # Next.js 14 Frontend
│   │   ├── src/
│   │   │   ├── app/         # App Router pages
│   │   │   ├── components/  # Reusable components
│   │   │   ├── lib/         # Utilities and API client
│   │   │   └── styles/      # Global styles
│   │   └── public/          # Static assets
│   └── api/                 # NestJS Backend
│       ├── src/
│       │   ├── auth/        # Authentication module
│       │   ├── users/       # User management
│       │   ├── studios/     # Studio/creator features
│       │   ├── videos/      # Video processing
│       │   ├── chat/        # Real-time messaging
│       │   ├── calls/       # Video calls
│       │   ├── store/       # Store system
│       │   ├── wallet/      # Token economy
│       │   ├── admin/       # Admin console
│       │   └── kidzone/     # Kid-safe features
│       └── prisma/          # Database schema
└── packages/
    ├── types/               # Shared TypeScript types
    └── ui/                  # Shared UI components
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis (for queues and caching)
- Cloudflare account with:
  - Pages (for hosting)
  - R2 (for storage)
  - Stream (for video processing)
  - Domain: ayinel.com

### 1. Clone and Install

```bash
git clone <your-repo>
cd ayinel_cloudflare_v2
npm install
```

### 2. Environment Setup

#### API Environment

```bash
cd apps/api
cp env.example .env
# Edit .env with your configuration
```

#### Web Environment

```bash
cd apps/web
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

### 4. Start Development

```bash
# Start both API and Web (from root)
npm run dev

# Or start individually
npm run dev:api    # http://localhost:3001
npm run dev:web    # http://localhost:3000
```

## 🛠️ Development

### Available Scripts

```bash
# Root level
npm run dev              # Start both API and Web
npm run dev:api          # Start API only
npm run dev:web          # Start Web only
npm run build            # Build all packages
npm run format           # Format code
npm run lint             # Lint code

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio

# API specific
npm run start:dev        # Start API in dev mode
npm run build:api        # Build API
npm run test:api         # Run API tests

# Web specific
npm run build:web        # Build Web app
npm run start:web        # Start Web in production mode
```

### Project Structure

#### Frontend (Next.js 14)

- **App Router**: Modern Next.js routing
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: High-quality components
- **TypeScript**: Full type safety

#### Backend (NestJS)

- **Modular Architecture**: Feature-based modules
- **Prisma ORM**: Type-safe database access
- **WebSocket Gateway**: Real-time features
- **JWT Authentication**: Secure auth system
- **Rate Limiting**: API protection
- **Queue System**: Background processing

#### Database (PostgreSQL)

- **Comprehensive Schema**: All platform features
- **Relationships**: Proper foreign keys
- **Indexes**: Optimized queries
- **Migrations**: Version-controlled schema

## 🌐 Deployment

### Cloudflare Pages Deployment

1. **Connect Repository** to Cloudflare Pages
2. **Configure Build Settings**:
   - Framework: Next.js
   - Build command: `npm run build:web`
   - Output directory: `.next`
   - Root directory: `apps/web`

3. **Set Environment Variables**:

   ```
   NEXT_PUBLIC_API_URL=https://api.ayinel.com
   NEXT_PUBLIC_BRAND_NAME=Ayinel
   NEXT_PUBLIC_BRAND_WORDS=Channel→Studio,Subscribe→Join,Follow→Tune-In,Like→Boost,Comment→Chat,Playlist→Collection,Shorts→Flips,Live→Broadcast,Subscribers→Crew,Recommendations→For You Stream
   NEXT_PUBLIC_LIVEKIT_URL=wss://your.livekit.host
   ```

4. **Deploy**: Your site will be available at `https://ayinel.com`

### API Deployment

Deploy the NestJS API to your preferred hosting:

- **Railway**: Easy deployment with PostgreSQL
- **Heroku**: Traditional hosting
- **DigitalOcean**: App Platform
- **AWS**: ECS or Lambda

### Domain Setup

Follow the [Domain Setup Guide](./domain-setup.md) to configure `ayinel.com` with:

- DNS configuration
- SSL certificates
- Performance optimization
- Security settings

## 🔧 Configuration

### Required Services

#### Cloudflare Services

- **Pages**: Frontend hosting
- **R2**: File storage
- **Stream**: Video processing
- **Workers**: Edge functions (optional)

#### Third-Party Services

- **Stripe**: Payments and payouts
- **PayPal**: Alternative payments
- **LiveKit**: Video calls
- **SendGrid**: Email delivery
- **Redis**: Caching and queues

### Environment Variables

See [API Environment](./apps/api/env.example) and [Web Environment](./apps/web/.env.example) for complete configuration.

## 📊 Features Overview

### User Experience

- **Customizable Profiles**: Fonts, colors, wallpapers, music
- **Social Features**: Friends, messaging, video calls
- **Content Discovery**: Recommendations, trending, categories
- **Mobile-First**: Responsive design

### Creator Tools

- **Studio Dashboard**: Analytics, uploads, settings
- **Video Editor**: Basic trimming and thumbnails
- **Monetization**: Memberships, tips, store items
- **Analytics**: Views, engagement, earnings

### KidZone Safety

- **Age Verification**: Guardian consent required
- **Content Filtering**: Safe discovery only
- **Kid-Only Features**: Isolated chat and calls
- **Learning Content**: Educational tiles and games

### Admin Features

- **User Management**: Ban, suspend, moderate
- **Content Moderation**: Reports, takedowns
- **Analytics**: Platform metrics and insights
- **Feature Flags**: A/B testing and rollouts

## 🚀 Getting Started with Development

### 1. Set up Database

```bash
# Install PostgreSQL locally or use cloud service
# Update DATABASE_URL in apps/api/.env

# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 2. Configure Services

```bash
# Set up Stripe account and get keys
# Configure PayPal integration
# Set up LiveKit server
# Configure Cloudflare R2 and Stream
```

### 3. Start Development

```bash
# Terminal 1: API
npm run dev:api

# Terminal 2: Web
npm run dev:web

# Terminal 3: Database (optional)
npm run db:studio
```

### 4. Access Applications

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api
- **Database**: http://localhost:5555 (Prisma Studio)

## 📚 Documentation

- [Deployment Guide](./pages-deploy.md)
- [Domain Setup](./domain-setup.md)
- [API Documentation](./apps/api/README.md)
- [Database Schema](./apps/api/prisma/schema.prisma)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:

- Check the documentation
- Review deployment guides
- Contact the development team

---

**Ayinel v2** - Building the future of video content creation and consumption. 🎬✨
