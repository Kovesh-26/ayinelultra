#!/bin/bash

# Ayinel Platform - Complete Production Deployment Script
# This script sets up everything needed for production deployment

set -e

# Configuration
DOMAIN="ayinel.com"
DB_NAME="ayinel_prod"
DB_USER="ayinel_user"
DB_PASS="$(openssl rand -base64 32)"
JWT_SECRET="$(openssl rand -base64 64)"
REDIS_PASS="$(openssl rand -base64 32)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
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

warning() {
    echo -e "${YELLOW}⚠️ WARNING:${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root (use sudo)"
    fi
}

# Update system packages
update_system() {
    log "Updating system packages..."
    apt update && apt upgrade -y
    success "System updated"
}

# Install system dependencies
install_system_deps() {
    log "Installing system dependencies..."
    
    # Essential packages
    apt install -y curl wget git unzip software-properties-common \
                   apt-transport-https ca-certificates gnupg lsb-release \
                   build-essential python3 python3-pip
    
    # Node.js 18.x
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
    
    # Install pnpm
    npm install -g pnpm
    
    # Install PM2 for process management
    npm install -g pm2
    
    success "System dependencies installed"
}

# Install and configure Nginx
setup_nginx() {
    log "Setting up Nginx web server..."
    
    # Install Nginx
    apt install -y nginx
    
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
    systemctl enable nginx
    
    success "Nginx configured and enabled"
}

# Install and configure PostgreSQL
setup_postgresql() {
    log "Setting up PostgreSQL database..."
    
    # Install PostgreSQL
    apt install -y postgresql postgresql-contrib
    
    # Start and enable PostgreSQL
    systemctl start postgresql
    systemctl enable postgresql
    
    # Create database and user
    sudo -u postgres psql << EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;
\q
EOF
    
    # Configure PostgreSQL for external connections
    sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/*/main/postgresql.conf
    
    # Allow connections from localhost
    echo "host    $DB_NAME    $DB_USER    127.0.0.1/32            md5" >> /etc/postgresql/*/main/pg_hba.conf
    echo "host    $DB_NAME    $DB_USER    ::1/128                 md5" >> /etc/postgresql/*/main/pg_hba.conf
    
    # Restart PostgreSQL
    systemctl restart postgresql
    
    success "PostgreSQL configured"
}

# Install and configure Redis
setup_redis() {
    log "Setting up Redis..."
    
    # Install Redis
    apt install -y redis-server
    
    # Configure Redis
    sed -i 's/# requirepass foobared/requirepass '"$REDIS_PASS"'/' /etc/redis/redis.conf
    sed -i 's/bind 127.0.0.1/bind 127.0.0.1/' /etc/redis/redis.conf
    
    # Start and enable Redis
    systemctl start redis-server
    systemctl enable redis-server
    
    success "Redis configured"
}

# Install and configure SSL certificates
setup_ssl() {
    log "Setting up SSL certificates with Let's Encrypt..."
    
    # Install Certbot
    apt install -y certbot python3-certbot-nginx
    
    # Get SSL certificates
    certbot --nginx -d ayinel.com -d www.ayinel.com --non-interactive --agree-tos --email admin@ayinel.com
    certbot --nginx -d api.ayinel.com --non-interactive --agree-tos --email admin@ayinel.com
    
    # Setup auto-renewal
    echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
    
    success "SSL certificates configured"
}

# Setup application directory
setup_app_directory() {
    log "Setting up application directory..."
    
    # Create application directory
    mkdir -p /var/www/ayinel
    mkdir -p /var/www/ayinel/uploads
    mkdir -p /var/www/ayinel/logs
    
    # Set permissions
    chown -R www-data:www-data /var/www/ayinel
    chmod -R 755 /var/www/ayinel
    
    success "Application directory created"
}

# Install application dependencies
install_app_deps() {
    log "Installing application dependencies..."
    
    cd /var/www/ayinel
    
    # Install dependencies
    pnpm install
    
    # Build frontend
    pnpm --filter @ayinel/web build
    
    # Build backend
    pnpm --filter @ayinel/api build
    
    success "Application dependencies installed and built"
}

# Setup environment variables
setup_environment() {
    log "Setting up environment variables..."
    
    cat > /var/www/ayinel/.env << EOF
# Production Environment
NODE_ENV=production

# Database
DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME?schema=public"

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
DOMAIN="$DOMAIN"
API_URL="https://api.ayinel.com"
WEB_URL="https://ayinel.com"
EOF
    
    # Set permissions
    chown www-data:www-data /var/www/ayinel/.env
    chmod 600 /var/www/ayinel/.env
    
    success "Environment variables configured"
}

# Setup database schema
setup_database_schema() {
    log "Setting up database schema..."
    
    cd /var/www/ayinel/apps/api
    
    # Run Prisma migrations
    npx prisma migrate deploy
    
    # Generate Prisma client
    npx prisma generate
    
    success "Database schema setup complete"
}

# Setup PM2 process management
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
    
    # Start applications
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
    
    success "PM2 process management configured"
}

# Setup firewall
setup_firewall() {
    log "Setting up firewall..."
    
    # Install UFW if not present
    apt install -y ufw
    
    # Configure firewall
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow 80
    ufw allow 443
    ufw allow 3000
    ufw allow 3001
    
    # Enable firewall
    ufw --force enable
    
    success "Firewall configured"
}

# Setup monitoring and logging
setup_monitoring() {
    log "Setting up monitoring and logging..."
    
    # Install monitoring tools
    apt install -y htop iotop nethogs
    
    # Setup log rotation
    cat > /etc/logrotate.d/ayinel << 'EOF'
/var/www/ayinel/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
    
    success "Monitoring and logging configured"
}

# Setup backup script
setup_backup() {
    log "Setting up backup system..."
    
    cat > /var/www/ayinel/scripts/backup.sh << 'EOF'
#!/bin/bash

# Backup script for Ayinel platform
BACKUP_DIR="/var/backups/ayinel"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Database backup
pg_dump -U ayinel_user ayinel_prod > $BACKUP_DIR/db_backup_$DATE.sql

# Application backup
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz -C /var/www/ayinel .

# Uploads backup
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz -C /var/www/ayinel uploads

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF
    
    chmod +x /var/www/ayinel/scripts/backup.sh
    
    # Setup daily backup cron job
    echo "0 2 * * * /var/www/ayinel/scripts/backup.sh" | crontab -
    
    success "Backup system configured"
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
    
    # Check database connection
    if sudo -u postgres psql -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1; then
        success "Database connection successful"
    else
        error "Database connection failed"
    fi
    
    # Check Redis connection
    if redis-cli -a $REDIS_PASS ping > /dev/null 2>&1; then
        success "Redis connection successful"
    else
        error "Redis connection failed"
    fi
    
    # Check Nginx
    if systemctl is-active --quiet nginx; then
        success "Nginx is running"
    else
        error "Nginx is not running"
    fi
}

# Display deployment summary
show_summary() {
    echo ""
    echo -e "${GREEN}🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
    echo "================================================"
    echo ""
    echo -e "${BLUE}🌐 Your Ayinel platform is now live at:${NC}"
    echo "   Frontend: https://ayinel.com"
    echo "   API:      https://api.ayinel.com"
    echo ""
    echo -e "${BLUE}📊 Service Status:${NC}"
    echo "   Web App:  http://localhost:3000"
    echo "   API:      http://localhost:3001"
    echo "   Database: localhost:5432"
    echo "   Redis:    localhost:6379"
    echo ""
    echo -e "${BLUE}🔐 Credentials:${NC}"
    echo "   Database: $DB_NAME"
    echo "   DB User:  $DB_USER"
    echo "   DB Pass:  $DB_PASS"
    echo "   Redis Pass: $REDIS_PASS"
    echo "   JWT Secret: $JWT_SECRET"
    echo ""
    echo -e "${BLUE}📁 Important Files:${NC}"
    echo "   App Directory: /var/www/ayinel"
    echo "   Logs:         /var/www/ayinel/logs"
    echo "   Uploads:      /var/www/ayinel/uploads"
    echo "   Environment:  /var/www/ayinel/.env"
    echo ""
    echo -e "${BLUE}🛠️ Management Commands:${NC}"
    echo "   PM2 Status:    pm2 status"
    echo "   PM2 Logs:      pm2 logs"
    echo "   PM2 Restart:   pm2 restart all"
    echo "   Nginx Status:  systemctl status nginx"
    echo "   DB Status:     systemctl status postgresql"
    echo "   Redis Status:  systemctl status redis-server"
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo "   1. Configure your domain DNS to point to this server"
    echo "   2. Set up payment gateway webhooks"
    echo "   3. Configure email settings"
    echo "   4. Set up monitoring and alerts"
    echo "   5. Test all platform features"
    echo ""
    echo -e "${YELLOW}⚠️ IMPORTANT: Save the credentials above securely!${NC}"
    echo ""
}

# Main deployment flow
main() {
    echo -e "${BLUE}🚀 Ayinel Platform - Production Deployment${NC}"
    echo "================================================"
    echo ""
    
    check_root
    update_system
    install_system_deps
    setup_nginx
    setup_postgresql
    setup_redis
    setup_app_directory
    install_app_deps
    setup_environment
    setup_database_schema
    setup_pm2
    setup_firewall
    setup_monitoring
    setup_backup
    setup_ssl
    health_check
    show_summary
}

# Run main function
main "$@"
