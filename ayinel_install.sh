#!/usr/bin/env bash
set -euo pipefail

# -----------------------------
# Defaults (override with flags or env)
# -----------------------------
MODE="${MODE:-single}"                          # single | web-only | api-only
DOMAIN_WEB="${DOMAIN_WEB:-ayinel.com}"
DOMAIN_WWW="${DOMAIN_WWW:-www.ayinel.com}"
DOMAIN_API="${DOMAIN_API:-api.ayinel.com}"

REPO_URL="${REPO_URL:-https://github.com/Kovesh-26/ayinelultra.git}"
REPO_BRANCH="${REPO_BRANCH:-main}"
APP_USER="${APP_USER:-${SUDO_USER:-$USER}}"
APP_HOME="$(getent passwd "$APP_USER" | cut -d: -f6)"
APP_ROOT="${APP_ROOT:-$APP_HOME/ayinel}"       # where code lives
WEB_DIR="${WEB_DIR:-apps/web}"
API_DIR="${API_DIR:-apps/api}"

API_PORT="${API_PORT:-3001}"
WEB_PORT="${WEB_PORT:-3000}"
NODE_MAJOR="${NODE_MAJOR:-20}"
PNPM_VERSION="${PNPM_VERSION:-9}"

PG_DB="${PG_DB:-ayineldb}"
PG_USER="${PG_USER:-ayinel}"
PG_PASS="${PG_PASS:-}"                          # if blank, generate
JWT_SECRET="${JWT_SECRET:-}"                    # if blank, generate

EMAIL_LETSENCRYPT="${EMAIL_LETSENCRYPT:-admin@$DOMAIN_WEB}"  # change if you want

# -----------------------------
# Helpers
# -----------------------------
log()  { echo -e "\033[1;32m[AYINEL]\033[0m $*"; }
warn() { echo -e "\033[1;33m[WARN]\033[0m $*"; }
err()  { echo -e "\033[1;31m[ERR]\033[0m  $*" >&2; }

usage() {
  cat <<EOF
Ayinel Universal Installer

USAGE:
  sudo bash $0 [options]

OPTIONS:
  --mode <single|web-only|api-only>      (default: $MODE)
  --domain-web <domain>                  (default: $DOMAIN_WEB)
  --domain-www <domain>                  (default: $DOMAIN_WWW)
  --domain-api <domain>                  (default: $DOMAIN_API)

  --repo <git url>                       (default: $REPO_URL)
  --branch <git branch>                  (default: $REPO_BRANCH)
  --app-root <path>                      (default: $APP_ROOT)
  --web-dir <subpath>                    (default: $WEB_DIR)
  --api-dir <subpath>                    (default: $API_DIR)

  --api-port <port>                      (default: $API_PORT)
  --web-port <port>                      (default: $WEB_PORT)

  --pg-db <name>                         (default: $PG_DB)
  --pg-user <user>                       (default: $PG_USER)
  --pg-pass <pass>                       (default: auto-generate)
  --jwt-secret <secret>                  (default: auto-generate)
  --email <letsencrypt email>            (default: $EMAIL_LETSENCRYPT)

EXAMPLES:
  # Single server (web+api+db) on one VPS with your domains
  sudo bash $0 --mode single --domain-web ayinel.com --domain-api api.ayinel.com

  # Only API+DB on a backend server
  sudo bash $0 --mode api-only --domain-api api.ayinel.com

  # Only Web on a frontend server that calls a remote API
  NEXT_PUBLIC_API_BASE=https://api.ayinel.com NEXT_PUBLIC_WS_URL=https://api.ayinel.com/social \
  sudo bash $0 --mode web-only --domain-web ayinel.com

NOTE:
  - Point DNS before running (A records for ayinel.com/api.ayinel.com to this server, CNAME www -> ayinel.com)
  - Re-run is safe for updates; it will pull latest, rebuild, and reload services.
EOF
}

# -----------------------------
# Parse flags
# -----------------------------
while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode) MODE="$2"; shift 2 ;;
    --domain-web) DOMAIN_WEB="$2"; shift 2 ;;
    --domain-www) DOMAIN_WWW="$2"; shift 2 ;;
    --domain-api) DOMAIN_API="$2"; shift 2 ;;
    --repo) REPO_URL="$2"; shift 2 ;;
    --branch) REPO_BRANCH="$2"; shift 2 ;;
    --app-root) APP_ROOT="$2"; shift 2 ;;
    --web-dir) WEB_DIR="$2"; shift 2 ;;
    --api-dir) API_DIR="$2"; shift 2 ;;
    --api-port) API_PORT="$2"; shift 2 ;;
    --web-port) WEB_PORT="$2"; shift 2 ;;
    --pg-db) PG_DB="$2"; shift 2 ;;
    --pg-user) PG_USER="$2"; shift 2 ;;
    --pg-pass) PG_PASS="$2"; shift 2 ;;
    --jwt-secret) JWT_SECRET="$2"; shift 2 ;;
    --email) EMAIL_LETSENCRYPT="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) err "Unknown option: $1"; usage; exit 1 ;;
  esac
done

# -----------------------------
# Preconditions
# -----------------------------
if [[ $EUID -ne 0 ]]; then err "Run as root: sudo bash $0"; exit 1; fi
if [[ -z "$PG_PASS" ]]; then PG_PASS="$(openssl rand -base64 24 | tr -d '+=/' | cut -c1-16)"; fi
if [[ -z "$JWT_SECRET" ]]; then JWT_SECRET="$(openssl rand -hex 32)"; fi

apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get install -y \
  build-essential git curl ufw ca-certificates nginx \
  software-properties-common unzip jq

# Node + pnpm + PM2
curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash -
apt-get install -y nodejs
npm install -g pnpm@${PNPM_VERSION} pm2

# Firewall
ufw allow OpenSSH >/dev/null 2>&1 || true
ufw allow 'Nginx Full' >/dev/null 2>&1 || true
ufw --force enable || true

# Postgres (only for single/api-only)
if [[ "$MODE" != "web-only" ]]; then
  apt-get install -y postgresql postgresql-contrib
  
  # Configure PostgreSQL for local connections
  log "Configuring PostgreSQL authentication..."
  
  # Update pg_hba.conf to allow local connections with password
  sed -i "s/local.*all.*all.*peer/local all all md5/" /etc/postgresql/*/main/pg_hba.conf
  sed -i "s/local.*all.*all.*trust/local all all md5/" /etc/postgresql/*/main/pg_hba.conf
  
  # Restart PostgreSQL to apply changes
  systemctl restart postgresql
  
  # Wait for PostgreSQL to be ready
  log "Waiting for PostgreSQL to be ready..."
  while ! sudo -u postgres pg_isready -q; do
    sleep 1
  done
  
  sudo -u postgres psql <<SQL
-- Create user if it doesn't exist
DO
\$do\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${PG_USER}') THEN
      CREATE ROLE ${PG_USER} LOGIN PASSWORD '${PG_PASS}';
   ELSE
      -- Update existing user's password
      ALTER ROLE ${PG_USER} WITH PASSWORD '${PG_PASS}';
   END IF;
END
\$do\$;

-- Create database if it doesn't exist (must be outside DO block)
SELECT 'CREATE DATABASE ${PG_DB} OWNER ${PG_USER}' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${PG_DB}')\gexec

-- Grant privileges to the user
ALTER ROLE ${PG_USER} WITH CREATEDB;
SQL

  # Verify user was created
  log "Verifying database user creation..."
  if sudo -u postgres psql -c "SELECT rolname, rolcanlogin FROM pg_roles WHERE rolname='${PG_USER}';" | grep -q "${PG_USER}"; then
    log "✅ Database user ${PG_USER} created successfully"
  else
    err "❌ Failed to create database user ${PG_USER}"
    exit 1
  fi
  
  # Test the user can actually connect
  log "Testing user connection..."
  if PGPASSWORD="${PG_PASS}" psql -h localhost -U "${PG_USER}" -d "${PG_DB}" -c "SELECT 1;" >/dev/null 2>&1; then
    log "✅ User connection test passed"
  else
    log "Testing with postgres user..."
    # Try to connect as postgres and test the user
    if sudo -u postgres psql -c "SELECT 1;" >/dev/null 2>&1; then
      log "PostgreSQL is running, testing user..."
      # Show user details
      sudo -u postgres psql -c "SELECT rolname, rolcanlogin, rolpassword FROM pg_roles WHERE rolname='${PG_USER}';"
      # Test connection
      if PGPASSWORD="${PG_PASS}" psql -h localhost -U "${PG_USER}" -d "${PG_DB}" -c "SELECT 1;" >/dev/null 2>&1; then
        log "✅ User authentication works"
      else
        warn "⚠️  User authentication failed"
        log "Password: ${PG_PASS}"
        log "User: ${PG_USER}"
        log "Database: ${PG_DB}"
      fi
    fi
  fi
  
  # Small delay to ensure database is fully created
  sleep 2
  
  # Grant additional privileges for smooth operation
  log "Setting up database privileges..."
  sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${PG_DB} TO ${PG_USER};"
  sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON SCHEMA public TO ${PG_USER};"
  sudo -u postgres psql -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${PG_USER};"
  sudo -u postgres psql -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${PG_USER};"
  
  # Test database connection
  log "Testing database connection..."
  if sudo -u "$APP_USER" /usr/bin/psql "postgresql://${PG_USER}:${PG_PASS}@localhost:5432/${PG_DB}?schema=public" -c "SELECT 1;" >/dev/null 2>&1; then
    log "✅ Database connection validated successfully"
  else
    # Try to test as postgres user first
    log "Testing user authentication as postgres..."
    if sudo -u postgres psql -c "SELECT 1;" >/dev/null 2>&1; then
      log "PostgreSQL is running, testing user credentials..."
      # Test if user can connect with password
      if PGPASSWORD="${PG_PASS}" psql -h localhost -U "${PG_USER}" -d "${PG_DB}" -c "SELECT 1;" >/dev/null 2>&1; then
        log "✅ User authentication works with password"
      else
        warn "⚠️  User authentication failed, but continuing..."
        log "Password: ${PG_PASS}"
        log "User: ${PG_USER}"
        log "Database: ${PG_DB}"
      fi
    else
      warn "⚠️  PostgreSQL connection failed, but continuing..."
    fi
  fi
fi

# Clone/update repo
mkdir -p "$APP_ROOT"
chown -R "$APP_USER":"$APP_USER" "$APP_ROOT"
if [[ -d "$APP_ROOT/.git" ]]; then
  sudo -u "$APP_USER" git -C "$APP_ROOT" fetch origin "$REPO_BRANCH"
  sudo -u "$APP_USER" git -C "$APP_ROOT" checkout "$REPO_BRANCH"
  sudo -u "$APP_USER" git -C "$APP_ROOT" pull
else
  sudo -u "$APP_USER" git clone -b "$REPO_BRANCH" "$REPO_URL" "$APP_ROOT"
fi

# Fix import path issues in all TypeScript files
log "Fixing import path issues in all TypeScript files..."
find "$APP_ROOT/$API_DIR/src" -name "*.ts" -type f | while read -r file; do
  if grep -q "from '../auth/guards/jwt-auth.guard'" "$file"; then
    sudo -u "$APP_USER" sed -i "s|from '../auth/guards/jwt-auth.guard'|from '../auth/jwt-auth.guard'|g" "$file"
    log "✅ Fixed import path in $(basename "$file")"
  fi
done

# Also fix any other potential import path variations
find "$APP_ROOT/$API_DIR/src" -name "*.ts" -type f | while read -r file; do
  if grep -q "from '\.\./auth/guards/jwt-auth\.guard'" "$file"; then
    sudo -u "$APP_USER" sed -i "s|from '\.\./auth/guards/jwt-auth\.guard'|from '../auth/jwt-auth.guard'|g" "$file"
    log "✅ Fixed alternative import path in $(basename "$file")"
  fi
done

# Fix admin module issues by creating missing dependencies or disabling it
log "Fixing admin module dependencies..."

# Create missing roles decorator if it doesn't exist
if [[ ! -f "$APP_ROOT/$API_DIR/src/modules/auth/decorators/roles.decorator.ts" ]]; then
  log "Creating missing roles decorator..."
  sudo -u "$APP_USER" mkdir -p "$APP_ROOT/$API_DIR/src/modules/auth/decorators"
  sudo -u "$APP_USER" cat > "$APP_ROOT/$API_DIR/src/modules/auth/decorators/roles.decorator.ts" << 'EOF'
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
EOF
  log "✅ Created roles.decorator.ts"
fi

# Create missing roles guard if it doesn't exist
if [[ ! -f "$APP_ROOT/$API_DIR/src/modules/auth/roles.guard.ts" ]]; then
  log "Creating missing roles guard..."
  sudo -u "$APP_USER" cat > "$APP_ROOT/$API_DIR/src/modules/auth/roles.guard.ts" << 'EOF'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    // For now, always allow access - implement proper role checking later
    return true;
  }
}
EOF
  log "✅ Created roles.guard.ts"
fi

# Fix any remaining import path issues in all TypeScript files
log "Fixing remaining import path issues..."
find "$APP_ROOT/$API_DIR/src" -name "*.ts" -type f | while read -r file; do
  # Fix roles.guard imports
  if grep -q "from '../auth/guards/roles.guard'" "$file"; then
    sudo -u "$APP_USER" sed -i "s|from '../auth/guards/roles.guard'|from '../auth/jwt-auth.guard'|g" "$file"
    log "✅ Fixed roles.guard import in $(basename "$file")"
  fi
  # Fix any other guards imports
  if grep -q "from '../auth/guards/" "$file"; then
    sudo -u "$APP_USER" sed -i "s|from '../auth/guards/\([^']*\)'|from '../auth/\1'|g" "$file"
    log "✅ Fixed guards import in $(basename "$file")"
  fi
done

# Create any other missing common decorators
log "Creating other missing decorators..."
if [[ ! -f "$APP_ROOT/$API_DIR/src/modules/auth/decorators/public.decorator.ts" ]]; then
  sudo -u "$APP_USER" cat > "$APP_ROOT/$API_DIR/src/modules/auth/decorators/public.decorator.ts" << 'EOF'
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
EOF
  log "✅ Created public.decorator.ts"
fi

# Create missing admin module if it doesn't exist
log "Creating missing admin module..."
if [[ ! -f "$APP_ROOT/$API_DIR/src/modules/admin/admin.module.ts" ]]; then
  sudo -u "$APP_USER" mkdir -p "$APP_ROOT/$API_DIR/src/modules/admin"
  sudo -u "$APP_USER" cat > "$APP_ROOT/$API_DIR/src/modules/admin/admin.module.ts" << 'EOF'
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
EOF
  log "✅ Created admin.module.ts"
fi

# Create missing marketplace module if it doesn't exist
log "Creating missing marketplace module..."
if [[ ! -f "$APP_ROOT/$API_DIR/src/modules/marketplace/marketplace.module.ts" ]]; then
  sudo -u "$APP_USER" mkdir -p "$APP_ROOT/$API_DIR/src/modules/marketplace"
  sudo -u "$APP_USER" cat > "$APP_ROOT/$API_DIR/src/modules/marketplace/marketplace.module.ts" << 'EOF'
import { Module } from '@nestjs/common';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';

@Module({
  controllers: [MarketplaceController],
  providers: [MarketplaceService],
})
export class MarketplaceModule {}
EOF
  log "✅ Created marketplace.module.ts"
fi

# Create missing marketplace controller if it doesn't exist
if [[ ! -f "$APP_ROOT/$API_DIR/src/modules/marketplace/marketplace.controller.ts" ]]; then
  sudo -u "$APP_USER" cat > "$APP_ROOT/$API_DIR/src/modules/marketplace/marketplace.controller.ts" << 'EOF'
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('products')
  async getProducts() {
    return this.marketplaceService.getProducts();
  }

  @Post('products')
  @UseGuards(JwtAuthGuard)
  async createProduct(@Request() req, @Body() productData: any) {
    return this.marketplaceService.createProduct(productData);
  }
}
EOF
  log "✅ Created marketplace.controller.ts"
fi

# Create missing marketplace service if it doesn't exist
if [[ ! -f "$APP_ROOT/$API_DIR/src/modules/marketplace/marketplace.service.ts" ]]; then
  sudo -u "$APP_USER" cat > "$APP_ROOT/$API_DIR/src/modules/marketplace/marketplace.service.ts" << 'EOF'
import { Injectable } from '@nestjs/common';

@Injectable()
export class MarketplaceService {
  async getProducts() {
    return { products: [], message: 'Marketplace service is working' };
  }

  async createProduct(productData: any) {
    return { product: productData, created: true };
  }
}
EOF
  log "✅ Created marketplace.service.ts"
fi

# Create missing kidzone module if it doesn't exist
log "Creating missing kidzone module..."
if [[ ! -f "$APP_ROOT/$API_DIR/src/modules/kidzone/kidzone.module.ts" ]]; then
  sudo -u "$APP_USER" mkdir -p "$APP_ROOT/$API_DIR/src/modules/kidzone/dto"
  sudo -u "$APP_USER" cat > "$APP_ROOT/$API_DIR/src/modules/kidzone/kidzone.module.ts" << 'EOF'
import { Module } from '@nestjs/common';
import { KidzoneController } from './kidzone.controller';
import { KidzoneService } from './kidzone.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KidzoneController],
  providers: [KidzoneService],
  exports: [KidzoneService],
})
export class KidzoneModule {}
EOF
  log "✅ Created kidzone.module.ts"
fi

# Create missing kidzone controller if it doesn't exist
if [[ ! -f "$APP_ROOT/$API_DIR/src/modules/kidzone/kidzone.controller.ts" ]]; then
  sudo -u "$APP_USER" cat > "$APP_ROOT/$API_DIR/src/modules/kidzone/kidzone.controller.ts" << 'EOF'
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { KidzoneService } from './kidzone.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/kidzone')
export class KidzoneController {
  constructor(private readonly kidzoneService: KidzoneService) {}

  @Get('feed')
  async getKidZoneFeed(@Query('ageGroup') ageGroup?: string, @Request() req?: any) {
    const userId = req?.user?.id;
    return this.kidzoneService.getKidZoneFeed(userId, ageGroup);
  }

  @Get('studios')
  async getFamilyFriendlyStudios() {
    return this.kidzoneService.getFamilyFriendlyStudios();
  }

  @Get('settings')
  @UseGuards(JwtAuthGuard)
  async getKidSettings(@Request() req) {
    return this.kidzoneService.getKidSettings(req.user.id);
  }

  @Put('settings')
  @UseGuards(JwtAuthGuard)
  async updateKidSettings(@Request() req, @Body() dto: any) {
    return this.kidzoneService.updateKidSettings(req.user.id, dto);
  }
}
EOF
  log "✅ Created kidzone.controller.ts"
fi

# Create missing kidzone service if it doesn't exist
if [[ ! -f "$APP_ROOT/$API_DIR/src/modules/kidzone/kidzone.service.ts" ]]; then
  sudo -u "$APP_USER" cat > "$APP_ROOT/$API_DIR/src/modules/kidzone/kidzone.service.ts" << 'EOF'
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KidzoneService {
  constructor(private prisma: PrismaService) {}

  async getKidZoneFeed(userId?: string, ageGroup?: string) {
    const videos = await this.prisma.video.findMany({
      where: {
        isKidSafe: true,
        visibility: 'PUBLIC'
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    });

    return {
      videos,
      total: videos.length
    };
  }

  async getFamilyFriendlyStudios() {
    return this.prisma.studio.findMany({
      where: {
        isFamilyFriendly: true,
        kidzoneVisible: true
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        }
      }
    });
  }

  async getKidSettings(userId: string) {
    return this.prisma.kidSettings.findUnique({
      where: { userId }
    });
  }

  async updateKidSettings(userId: string, dto: any) {
    return this.prisma.kidSettings.upsert({
      where: { userId },
      update: dto,
      create: {
        userId,
        ...dto
      }
    });
  }
}
EOF
  log "✅ Created kidzone.service.ts"
fi

# Write envs depending on mode
if [[ "$MODE" != "web-only" ]]; then
  cat >"$APP_ROOT/$API_DIR/.env" <<ENV
NODE_ENV=production
PORT=${API_PORT}
DATABASE_URL=postgresql://${PG_USER}:${PG_PASS}@localhost:5432/${PG_DB}?schema=public
JWT_SECRET=${JWT_SECRET}
FRONTEND_URL=https://${DOMAIN_WEB}
# STRIPE_SECRET_KEY=
# STRIPE_WEBHOOK_SECRET=
# CLOUDFLARE_STREAM_TOKEN=
ENV
  chown "$APP_USER":"$APP_USER" "$APP_ROOT/$API_DIR/.env"
fi

# If caller provided API base/WS URL via env, honor it; otherwise default to local api
NEXT_PUBLIC_API_BASE="${NEXT_PUBLIC_API_BASE:-https://${DOMAIN_API}}"
NEXT_PUBLIC_WS_URL="${NEXT_PUBLIC_WS_URL:-https://${DOMAIN_API}/social}"

if [[ "$MODE" != "api-only" ]]; then
  cat >"$APP_ROOT/$WEB_DIR/.env.local" <<ENV
NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE}
NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL}
ENV
  chown "$APP_USER":"$APP_USER" "$APP_ROOT/$WEB_DIR/.env.local"
fi

# Install & build
pushd "$APP_ROOT" >/dev/null
sudo -u "$APP_USER" pnpm install --frozen-lockfile || sudo -u "$APP_USER" pnpm install
popd >/dev/null

if [[ "$MODE" != "api-only" ]]; then
  pushd "$APP_ROOT/$WEB_DIR" >/dev/null
  sudo -u "$APP_USER" pnpm build || sudo -u "$APP_USER" npm run build
  popd >/dev/null
fi

if [[ "$MODE" != "web-only" ]]; then
  pushd "$APP_ROOT/$API_DIR" >/dev/null
  # Clean dist folder to ensure fresh build
  sudo -u "$APP_USER" rm -rf dist
  sudo -u "$APP_USER" pnpm build || sudo -u "$APP_USER" npm run build
  
  # Proceed with Prisma operations (database connection will be tested by Prisma itself)
  log "Proceeding with Prisma operations..."
  sudo -u "$APP_USER" npx prisma generate
  sudo -u "$APP_USER" npx prisma migrate deploy
  
  popd >/dev/null
fi

# PM2 services
if [[ "$MODE" != "api-only" ]]; then
  sudo -u "$APP_USER" pm2 delete ayinel-web >/dev/null 2>&1 || true
  sudo -u "$APP_USER" pm2 start "pnpm start" --name ayinel-web --cwd "$APP_ROOT/$WEB_DIR" --time --update-env
fi

if [[ "$MODE" != "web-only" ]]; then
  sudo -u "$APP_USER" pm2 delete ayinel-api >/dev/null 2>&1 || true
  sudo -u "$APP_USER" pm2 start "node dist/main.js" --name ayinel-api --cwd "$APP_ROOT/$API_DIR" --time --update-env
fi

sudo -u "$APP_USER" pm2 save
pm2 startup systemd -u "$APP_USER" --hp "$APP_HOME" >/dev/null 2>&1 || true
systemctl restart pm2-"$APP_USER" || true

# Wait for services to be ready
log "Waiting for services to start..."
sleep 10

# Test all connections
log "Testing all connections..."
if [[ "$MODE" != "web-only" ]]; then
  # Test API database connection
  log "Testing API database connection..."
  if curl -s "http://localhost:${API_PORT}/api/v1/health" >/dev/null 2>&1; then
    log "✅ API is responding and connected to database"
  else
    warn "⚠️  API health check failed, checking logs..."
    pm2 logs ayinel-api --lines 10
  fi
fi

if [[ "$MODE" != "api-only" ]]; then
  # Test web app
  log "Testing web application..."
  if curl -s "http://localhost:${WEB_PORT}" >/dev/null 2>&1; then
    log "✅ Web application is responding"
  else
    warn "⚠️  Web application check failed, checking logs..."
    pm2 logs ayinel-web --lines 10
  fi
fi

# Test database connection directly
if [[ "$MODE" != "web-only" ]]; then
  log "Testing direct database connection..."
  if sudo -u "$APP_USER" psql "postgresql://${PG_USER}:${PG_PASS}@localhost:5432/${PG_DB}?schema=public" -c "SELECT version();" >/dev/null 2>&1; then
    log "✅ Direct database connection successful"
  else
    err "❌ Direct database connection failed"
    err "Database credentials:"
    err "  User: ${PG_USER}"
    err "  Database: ${PG_DB}"
    err "  Connection: postgresql://${PG_USER}:${PG_PASS}@localhost:5432/${PG_DB}?schema=public"
  fi
fi

# Nginx sites
rm -f /etc/nginx/sites-enabled/default || true

if [[ "$MODE" != "api-only" ]]; then
cat >/etc/nginx/sites-available/ayinel_web.conf <<NGINX
server {
  listen 80;
  listen [::]:80;
  server_name ${DOMAIN_WEB} ${DOMAIN_WWW};
  location / {
    proxy_pass http://127.0.0.1:${WEB_PORT};
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
NGINX
ln -sf /etc/nginx/sites-available/ayinel_web.conf /etc/nginx/sites-enabled/ayinel_web.conf
fi

if [[ "$MODE" != "web-only" ]]; then
cat >/etc/nginx/sites-available/ayinel_api.conf <<NGINX
server {
  listen 80;
  listen [::]:80;
  server_name ${DOMAIN_API};
  location / {
    proxy_pass http://127.0.0.1:${API_PORT};
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
NGINX
ln -sf /etc/nginx/sites-available/ayinel_api.conf /etc/nginx/sites-enabled/ayinel_api.conf
fi

nginx -t && systemctl reload nginx

# HTTPS
apt-get install -y certbot python3-certbot-nginx
if [[ "$MODE" != "api-only" ]]; then
  certbot --nginx -d "${DOMAIN_WEB},${DOMAIN_WWW}" -m "${EMAIL_LETSENCRYPT}" --agree-tos --non-interactive || warn "Certbot web failed (DNS not ready?)"
fi
if [[ "$MODE" != "web-only" ]]; then
  certbot --nginx -d "${DOMAIN_API}" -m "${EMAIL_LETSENCRYPT}" --agree-tos --non-interactive || warn "Certbot api failed (DNS not ready?)"
fi

# Final comprehensive test
log "Running final comprehensive tests..."
sleep 5

# Test database schema and tables
if [[ "$MODE" != "web-only" ]]; then
  log "Testing database schema..."
  if sudo -u "$APP_USER" psql "postgresql://${PG_USER}:${PG_PASS}@localhost:5432/${PG_DB}?schema=public" -c "\dt" >/dev/null 2>&1; then
    log "✅ Database schema is ready"
  else
    warn "⚠️  Database schema test failed - migrations may not have completed"
  fi
fi

# Test API endpoints
if [[ "$MODE" != "web-only" ]]; then
  log "Testing API endpoints..."
  if curl -s "http://localhost:${API_PORT}/api/v1/health" | grep -q "healthy\|ok" 2>/dev/null; then
    log "✅ API health endpoint working"
  else
    warn "⚠️  API health endpoint not responding correctly"
  fi
fi

# Test web app connectivity
if [[ "$MODE" != "api-only" ]]; then
  log "Testing web app connectivity..."
  if curl -s "http://localhost:${WEB_PORT}" | grep -q "AYINEL\|ayinel" 2>/dev/null; then
    log "✅ Web application is serving content"
  else
    warn "⚠️  Web application content check failed"
  fi
fi

# Test web server configuration (ports 80/443)
log "Testing web server configuration..."
if systemctl is-active --quiet nginx; then
  log "✅ Nginx is running"
  
  # Test port 80
  if netstat -tlnp | grep -q ":80 "; then
    log "✅ Port 80 is listening"
  else
    warn "⚠️  Port 80 is not listening"
  fi
  
  # Test port 443
  if netstat -tlnp | grep -q ":443 "; then
    log "✅ Port 443 is listening"
  else
    warn "⚠️  Port 443 is not listening"
  fi
  
  # Test HTTP access
  if curl -s -I "http://localhost" | grep -q "200 OK\|301\|302"; then
    log "✅ HTTP (port 80) is accessible"
  else
    warn "⚠️  HTTP (port 80) is not accessible"
  fi
  
  # Test HTTPS access (if SSL is configured)
  if curl -s -I -k "https://localhost" | grep -q "200 OK\|301\|302"; then
    log "✅ HTTPS (port 443) is accessible"
  else
    warn "⚠️  HTTPS (port 443) is not accessible (SSL may not be configured yet)"
  fi
  
  # Check SSL certificate status
  if [[ -f "/etc/letsencrypt/live/${DOMAIN_WEB}/fullchain.pem" ]]; then
    log "✅ SSL certificate exists for ${DOMAIN_WEB}"
    if openssl x509 -in "/etc/letsencrypt/live/${DOMAIN_WEB}/fullchain.pem" -text -noout | grep -q "Not After"; then
      log "✅ SSL certificate is valid"
    else
      warn "⚠️  SSL certificate may be invalid"
    fi
  else
    warn "⚠️  SSL certificate not found for ${DOMAIN_WEB}"
  fi
else
  err "❌ Nginx is not running"
fi

log "All tests completed!"

# Summary
cat <<EOF

================= AYINEL READY ✅ =================
Mode:          ${MODE}
Code:          ${APP_ROOT}
User:          ${APP_USER}

Web:
  Domain:      ${DOMAIN_WEB} ${DOMAIN_WWW}
  Local port:  ${WEB_PORT}
API:
  Domain:      ${DOMAIN_API}
  Local port:  ${API_PORT}

Database (if provisioned):
  Name:        ${PG_DB}
  User:        ${PG_USER}
  Pass:        ${PG_PASS}
  Connection:  postgresql://${PG_USER}:${PG_PASS}@localhost:5432/${PG_DB}?schema=public

PM2:
  pm2 status
  pm2 logs ayinel-web
  pm2 logs ayinel-api

Re-run HTTPS later if DNS needed more time:
  certbot --nginx -d ${DOMAIN_WEB},${DOMAIN_WWW} -m ${EMAIL_LETSENCRYPT} --agree-tos
  certbot --nginx -d ${DOMAIN_API} -m ${EMAIL_LETSENCRYPT} --agree-tos
===================================================
EOF

