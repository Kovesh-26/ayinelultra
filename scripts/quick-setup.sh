#!/bin/bash

# Ayinel Platform - Quick Setup Script
# Use this when files are already migrated to /var/www/ayinel

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}❌ ERROR:${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}✅ SUCCESS:${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root (use sudo)"
    fi
}

# Check if application directory exists
check_app_directory() {
    if [ ! -d "/var/www/ayinel" ]; then
        error "Application directory /var/www/ayinel not found. Please migrate your files first."
    fi
    
    if [ ! -f "/var/www/ayinel/package.json" ]; then
        error "package.json not found. Please ensure all files are migrated correctly."
    fi
    
    success "Application directory found"
}

# Install dependencies
install_dependencies() {
    log "Installing application dependencies..."
    
    cd /var/www/ayinel
    
    # Install dependencies
    pnpm install
    
    # Build applications
    log "Building frontend..."
    pnpm --filter @ayinel/web build
    
    log "Building backend..."
    pnpm --filter @ayinel/api build
    
    success "Dependencies installed and applications built"
}

# Setup environment
setup_environment() {
    log "Setting up environment variables..."
    
    cd /var/www/ayinel
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        warning "No .env file found. Creating from template..."
        
        # Generate secure passwords
        DB_PASS="$(openssl rand -base64 32)"
        JWT_SECRET="$(openssl rand -base64 64)"
        REDIS_PASS="$(openssl rand -base64 32)"
        
        cat > .env << EOF
# Production Environment
NODE_ENV=production

# Database
DATABASE_URL="postgresql://ayinel_user:$DB_PASS@localhost:5432/ayinel_prod?schema=public"

# JWT
JWT_SECRET="$JWT_SECRET"
JWT_EXPIRES_IN="7d"

# CORS
CORS_ORIGIN="https://ayinel.com,https://www.ayinel.com,https://api.ayinel.com"

# Redis
REDIS_URL="redis://:$REDIS_PASS@localhost:6379"

# File Upload
MAX_FILE_SIZE=104857600
UPLOAD_PATH="/var/www/ayinel/uploads"

# Server
PORT=3001
HOST=0.0.0.0

# Domain
DOMAIN="ayinel.com"
API_URL="https://api.ayinel.com"
WEB_URL="https://ayinel.com"
EOF
        
        # Set permissions
        chown www-data:www-data .env
        chmod 600 .env
        
        echo -e "${YELLOW}⚠️ Environment file created with generated credentials:${NC}"
        echo "   DB Password: $DB_PASS"
        echo "   JWT Secret: $JWT_SECRET"
        echo "   Redis Password: $REDIS_PASS"
        echo ""
        echo -e "${YELLOW}⚠️ Please save these credentials securely!${NC}"
        echo ""
    else
        success "Environment file already exists"
    fi
}

# Setup database
setup_database() {
    log "Setting up database..."
    
    cd /var/www/ayinel/apps/api
    
    # Check if PostgreSQL is running
    if ! systemctl is-active --quiet postgresql; then
        error "PostgreSQL is not running. Please start it first."
    fi
    
    # Run migrations
    log "Running database migrations..."
    npx prisma migrate deploy
    
    # Generate Prisma client
    log "Generating Prisma client..."
    npx prisma generate
    
    success "Database setup complete"
}

# Setup PM2
setup_pm2() {
    log "Setting up PM2 process management..."
    
    cd /var/www/ayinel
    
    # Create PM2 ecosystem file
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'ayinel-api',
      script: 'apps/api/dist/main.js',
      cwd: '/var/www/ayinel',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/var/www/ayinel/logs/api-error.log',
      out_file: '/var/www/ayinel/logs/api-out.log',
      log_file: '/var/www/ayinel/logs/api-combined.log',
      time: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10
    },
    {
      name: 'ayinel-web',
      script: 'apps/web/node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/ayinel/apps/web',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/www/ayinel/logs/web-error.log',
      out_file: '/var/www/ayinel/logs/web-out.log',
      log_file: '/var/www/ayinel/logs/web-combined.log',
      time: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10
    }
  ]
};
EOF
    
    # Create logs directory
    mkdir -p logs
    
    # Start applications
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
    
    success "PM2 configured and applications started"
}

# Setup Nginx configuration
setup_nginx() {
    log "Setting up Nginx configuration..."
    
    # Check if Nginx is installed
    if ! command -v nginx &> /dev/null; then
        error "Nginx is not installed. Please install it first."
    fi
    
    # Create Nginx configuration
    cat > /etc/nginx/sites-available/ayinel << 'EOF'
server {
    listen 80;
    server_name ayinel.com www.ayinel.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ayinel.com www.ayinel.com;
    
    # SSL Configuration (will be configured by Certbot)
    ssl_certificate /etc/letsencrypt/live/ayinel.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ayinel.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # API endpoints
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files
    location /_next/static/ {
        alias /var/www/ayinel/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Uploads
    location /uploads/ {
        alias /var/www/ayinel/uploads/;
        expires 1y;
        add_header Cache-Control "public";
    }
}

server {
    listen 80;
    server_name api.ayinel.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.ayinel.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.ayinel.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.ayinel.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # API
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
    
    # Enable site
    ln -sf /etc/nginx/sites-available/ayinel /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Test configuration
    nginx -t
    
    # Reload Nginx
    systemctl reload nginx
    
    success "Nginx configured"
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Wait for services to start
    sleep 10
    
    # Check if services are running
    if pm2 list | grep -q "ayinel-api.*online"; then
        success "API service is running"
    else
        error "API service is not running"
    fi
    
    if pm2 list | grep -q "ayinel-web.*online"; then
        success "Web service is running"
    else
        error "Web service is not running"
    fi
    
    # Check Nginx
    if systemctl is-active --quiet nginx; then
        success "Nginx is running"
    else
        error "Nginx is not running"
    fi
}

# Show summary
show_summary() {
    echo ""
    echo -e "${GREEN}🎉 QUICK SETUP COMPLETED!${NC}"
    echo "================================"
    echo ""
    echo -e "${BLUE}🌐 Your Ayinel platform is now running at:${NC}"
    echo "   Frontend: http://localhost:3000"
    echo "   API:      http://localhost:3001"
    echo ""
    echo -e "${BLUE}🛠️ Management Commands:${NC}"
    echo "   PM2 Status:    pm2 status"
    echo "   PM2 Logs:      pm2 logs"
    echo "   PM2 Restart:   pm2 restart all"
    echo "   Nginx Status:  systemctl status nginx"
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo "   1. Configure your domain DNS to point to this server"
    echo "   2. Set up SSL certificates with Let's Encrypt"
    echo "   3. Configure payment gateway webhooks"
    echo "   4. Test all platform features"
    echo ""
}

# Main setup flow
main() {
    echo -e "${BLUE}🚀 Ayinel Platform - Quick Setup${NC}"
    echo "====================================="
    echo ""
    
    check_root
    check_app_directory
    install_dependencies
    setup_environment
    setup_database
    setup_pm2
    setup_nginx
    health_check
    show_summary
}

# Run main function
main "$@"
