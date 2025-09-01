# AYINEL - Next-gen Creator Platform

> Blending YouTube, Facebook, and MySpace for the ultimate creator experience

## 🚀 Overview

AYINEL is a comprehensive creator platform that combines the best features of YouTube (video + live streaming), Facebook (social + groups/DMs), and MySpace (deep profile/studio customization), with a dedicated KidZone and full monetization capabilities.

## 🏗️ Architecture

### Monorepo Structure
```
ayinel/
├── apps/
│   ├── api/          # NestJS backend API
│   ├── web/          # Next.js frontend
│   └── mobile/       # React Native mobile app
├── packages/
│   ├── types/        # Shared TypeScript types
│   └── ui/           # Shared UI components
└── scripts/          # Build and setup scripts
```

### Tech Stack

#### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + OAuth (Google/Apple)
- **Real-time**: Socket.IO
- **Queues**: BullMQ with Redis
- **Media**: Mux/Cloudflare Stream + S3/R2
- **Payments**: Stripe Connect
- **AI**: OpenAI + Built-in AI services
- **Email**: SendGrid/Mailgun

#### Frontend (Next.js)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query + Zustand
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Custom component library
- **Real-time**: Socket.IO client

#### Mobile (React Native)
- **Framework**: React Native with Expo
- **State Management**: TanStack Query + Zustand
- **Navigation**: React Navigation
- **UI**: Native components + custom design system

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL 14+ with pgAdmin4
- Redis (for queues and caching)
- Git

### 1. Clone and Install
```bash
git clone <repository-url>
cd ayinel
pnpm install
```

### 2. Database Setup

#### Using pgAdmin4:
1. Open pgAdmin4
2. Connect to your PostgreSQL server
3. Open the Query Tool
4. Run the setup script:
   ```sql
   -- Copy and paste the contents of scripts/setup-database.sql
   ```

#### Using psql:
```bash
psql -U postgres -f scripts/setup-database.sql
```

### 3. Environment Configuration
```bash
# Copy the environment template
cp env.local .env.local

# Edit the environment variables
# Update database credentials, API keys, etc.
```

### 4. Database Migration
```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed the database (optional)
pnpm db:seed
```

### 5. Start Development
```bash
# Start all services
pnpm dev

# Or start individual services
pnpm dev:api    # Backend API (port 3001)
pnpm dev:web    # Frontend (port 3000)
pnpm dev:mobile # Mobile app
```

## 📁 Project Structure

### Backend API (`apps/api/`)
```
src/
├── modules/           # Feature modules
│   ├── auth/         # Authentication
│   ├── users/        # User management
│   ├── studios/      # Studio management
│   ├── videos/       # Video content
│   ├── audio/        # Audio content
│   ├── live/         # Live streaming
│   ├── social/       # Social features
│   ├── payments/     # Payment processing
│   ├── ai/           # AI services
│   └── kidzone/      # KidZone features
├── common/           # Shared utilities
├── prisma/           # Database schema
└── main.ts           # Application entry point
```

### Frontend (`apps/web/`)
```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and configurations
├── stores/          # State management
└── types/           # TypeScript types
```

## 🎨 Brand Guidelines

### Terminology
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

### Design System
- **Primary Colors**: Purple gradient (#667eea to #764ba2)
- **Theme**: Dark mode with glassmorphism
- **Typography**: Inter font family
- **Icons**: Lucide React icon set

## 🔧 Development

### Available Scripts
```bash
# Development
pnpm dev              # Start all services
pnpm dev:api          # Start API only
pnpm dev:web          # Start web app only
pnpm dev:mobile       # Start mobile app only

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:studio        # Seed studio data

# Building
pnpm build            # Build all packages
pnpm build:api        # Build API
pnpm build:web        # Build web app
pnpm build:mobile     # Build mobile app

# Utilities
pnpm routes:scaffold  # Generate route pages
pnpm setup            # Complete setup
```

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality

### Testing
```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:cov

# Run e2e tests
pnpm test:e2e
```

## 🌐 API Documentation

Once the API is running, visit:
- **Swagger UI**: http://localhost:3001/api/docs
- **API Base URL**: http://localhost:3001/api/v1

## 📱 Features

### Core Features
- ✅ User authentication and profiles
- ✅ Studio creation and management
- ✅ Video upload and streaming
- ✅ Audio track management
- ✅ Live streaming capabilities
- ✅ Social features (comments, reactions, follows)
- ✅ Messaging and group chats
- ✅ Content collections
- ✅ Monetization (subscriptions, tips, storefronts)
- ✅ AI-powered content enhancement
- ✅ KidZone with parental controls
- ✅ Real-time notifications
- ✅ Advanced analytics

### Advanced Features
- 🔄 MySpace-style profile customization
- 🔄 AI-powered content moderation
- 🔄 Semantic search capabilities
- 🔄 Advanced analytics dashboard
- 🔄 Multi-language support
- 🔄 Mobile app (React Native)
- 🔄 PWA capabilities
- 🔄 Advanced monetization tools

## 🔒 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Rate limiting and DDoS protection
- Input validation with Zod
- SQL injection prevention (Prisma)
- XSS protection
- CSRF protection
- Secure file uploads
- Audit logging

## 🚀 Deployment

### Production Setup
1. Set up production environment variables
2. Configure database connections
3. Set up Redis for production
4. Configure media storage (S3/R2)
5. Set up monitoring (Sentry, PostHog)
6. Configure CDN for static assets
7. Set up SSL certificates
8. Configure load balancing

### Docker Support
```bash
# Build and run with Docker
docker-compose up -d

# Production build
docker-compose -f docker-compose.prod.yml up -d
```

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
- **Documentation**: [docs.ayinel.com](https://docs.ayinel.com)
- **Community**: [community.ayinel.com](https://community.ayinel.com)
- **Email**: support@ayinel.com

---

**AYINEL** - Empowering creators, connecting communities, building the future of content creation.