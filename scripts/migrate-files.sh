#!/bin/bash

# Ayinel Platform - File Migration Script
# Use this to migrate your files to the production server

set -e

# Configuration
SOURCE_DIR="."
TARGET_DIR="/var/www/ayinel"
BACKUP_DIR="/var/backups/ayinel"

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

warning() {
    echo -e "${YELLOW}⚠️ WARNING:${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root (use sudo)"
    fi
}

# Check if source directory exists
check_source() {
    if [ ! -d "$SOURCE_DIR" ]; then
        error "Source directory $SOURCE_DIR not found"
    fi
    
    if [ ! -f "$SOURCE_DIR/package.json" ]; then
        error "package.json not found in source directory"
    fi
    
    success "Source directory validated"
}

# Create backup of existing installation
create_backup() {
    if [ -d "$TARGET_DIR" ]; then
        log "Creating backup of existing installation..."
        
        mkdir -p "$BACKUP_DIR"
        BACKUP_NAME="ayinel_backup_$(date +%Y%m%d_%H%M%S)"
        
        tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$TARGET_DIR" .
        
        success "Backup created: $BACKUP_NAME.tar.gz"
    fi
}

# Clean target directory
clean_target() {
    log "Cleaning target directory..."
    
    if [ -d "$TARGET_DIR" ]; then
        rm -rf "$TARGET_DIR"/*
    else
        mkdir -p "$TARGET_DIR"
    fi
    
    success "Target directory cleaned"
}

# Migrate files
migrate_files() {
    log "Migrating files to production server..."
    
    # Copy all files
    cp -r "$SOURCE_DIR"/* "$TARGET_DIR/"
    
    # Copy hidden files
    cp -r "$SOURCE_DIR"/.* "$TARGET_DIR/" 2>/dev/null || true
    
    # Set proper permissions
    chown -R www-data:www-data "$TARGET_DIR"
    chmod -R 755 "$TARGET_DIR"
    
    # Make scripts executable
    find "$TARGET_DIR" -name "*.sh" -exec chmod +x {} \;
    
    success "Files migrated successfully"
}

# Create necessary directories
create_directories() {
    log "Creating necessary directories..."
    
    mkdir -p "$TARGET_DIR/uploads"
    mkdir -p "$TARGET_DIR/logs"
    mkdir -p "$TARGET_DIR/scripts"
    
    # Set permissions
    chown -R www-data:www-data "$TARGET_DIR"
    chmod -R 755 "$TARGET_DIR"
    
    success "Directories created"
}

# Setup environment file
setup_environment() {
    log "Setting up environment file..."
    
    cd "$TARGET_DIR"
    
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
UPLOAD_PATH="$TARGET_DIR/uploads"

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
    
    success "Environment file configured"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    cd "$TARGET_DIR"
    
    # Install dependencies
    pnpm install
    
    success "Dependencies installed"
}

# Build applications
build_applications() {
    log "Building applications..."
    
    cd "$TARGET_DIR"
    
    # Build frontend
    log "Building frontend..."
    pnpm --filter @ayinel/web build
    
    # Build backend
    log "Building backend..."
    pnpm --filter @ayinel/api build
    
    success "Applications built successfully"
}

# Setup database
setup_database() {
    log "Setting up database..."
    
    cd "$TARGET_DIR/apps/api"
    
    # Check if PostgreSQL is running
    if ! systemctl is-active --quiet postgresql; then
        warning "PostgreSQL is not running. Please start it first."
        return
    fi
    
    # Run migrations
    log "Running database migrations..."
    npx prisma migrate deploy
    
    # Generate Prisma client
    log "Generating Prisma client..."
    npx prisma generate
    
    success "Database setup complete"
}

# Show migration summary
show_summary() {
    echo ""
    echo -e "${GREEN}🎉 FILE MIGRATION COMPLETED!${NC}"
    echo "====================================="
    echo ""
    echo -e "${BLUE}📁 Files migrated to:${NC}"
    echo "   $TARGET_DIR"
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo "   1. Run the quick setup script:"
    echo "      sudo ./scripts/quick-setup.sh"
    echo ""
    echo "   2. Or run the full deployment script:"
    echo "      sudo ./scripts/deploy-production.sh"
    echo ""
    echo -e "${BLUE}🔐 Credentials Generated:${NC}"
    echo "   Check the output above for database and JWT credentials"
    echo ""
    echo -e "${YELLOW}⚠️ IMPORTANT: Save the credentials securely!${NC}"
    echo ""
}

# Main migration flow
main() {
    echo -e "${BLUE}🚀 Ayinel Platform - File Migration${NC}"
    echo "=========================================="
    echo ""
    
    check_root
    check_source
    create_backup
    clean_target
    migrate_files
    create_directories
    setup_environment
    install_dependencies
    build_applications
    setup_database
    show_summary
}

# Run main function
main "$@"
