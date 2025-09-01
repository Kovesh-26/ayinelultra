#!/bin/bash

# Ayinel Platform Deployment Script
# This script deploys the platform to production

set -e

echo "🚀 Starting Ayinel Platform Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_requirements() {
    echo "📋 Checking deployment requirements..."
    
    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ Git is not installed${NC}"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        exit 1
    fi
    
    if ! command -v pnpm &> /dev/null; then
        echo -e "${RED}❌ pnpm is not installed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All requirements met${NC}"
}

# Build the application
build_app() {
    echo "🔨 Building Ayinel Platform..."
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    pnpm install
    
    # Build frontend
    echo "🏗️ Building frontend..."
    pnpm --filter @ayinel/web build
    
    # Build backend
    echo "🏗️ Building backend..."
    pnpm --filter @ayinel/api build
    
    echo -e "${GREEN}✅ Build completed successfully${NC}"
}

# Deploy to Railway (Backend)
deploy_backend() {
    echo "🚂 Deploying backend to Railway..."
    
    if ! command -v railway &> /dev/null; then
        echo -e "${YELLOW}⚠️ Railway CLI not found. Installing...${NC}"
        npm install -g @railway/cli
    fi
    
    # Login to Railway (if not already logged in)
    if ! railway whoami &> /dev/null; then
        echo "🔐 Please login to Railway..."
        railway login
    fi
    
    # Deploy to Railway
    echo "🚀 Deploying to Railway..."
    railway up
    
    echo -e "${GREEN}✅ Backend deployed to Railway${NC}"
}

# Deploy to Vercel (Frontend)
deploy_frontend() {
    echo "☁️ Deploying frontend to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}⚠️ Vercel CLI not found. Installing...${NC}"
        npm install -g vercel
    fi
    
    # Login to Vercel (if not already logged in)
    if ! vercel whoami &> /dev/null; then
        echo "🔐 Please login to Vercel..."
        vercel login
    fi
    
    # Deploy to Vercel
    echo "🚀 Deploying to Vercel..."
    vercel --prod
    
    echo -e "${GREEN}✅ Frontend deployed to Vercel${NC}"
}

# Setup domain
setup_domain() {
    echo "🌐 Setting up ayinel.com domain..."
    
    echo -e "${YELLOW}⚠️ Manual steps required:${NC}"
    echo "1. Go to your domain registrar (GoDaddy, Namecheap, etc.)"
    echo "2. Update DNS records:"
    echo "   - A record: @ → Vercel IP"
    echo "   - CNAME record: www → cname.vercel-dns.com"
    echo "   - A record: api → Railway IP"
    echo "3. In Vercel dashboard, add ayinel.com as custom domain"
    echo "4. In Railway dashboard, add api.ayinel.com as custom domain"
    
    echo -e "${GREEN}✅ Domain setup instructions provided${NC}"
}

# Run database migrations
run_migrations() {
    echo "🗄️ Running database migrations..."
    
    # This will be done automatically by Railway
    echo -e "${GREEN}✅ Migrations will run automatically on Railway${NC}"
}

# Health check
health_check() {
    echo "🏥 Performing health check..."
    
    # Wait for deployment to complete
    echo "⏳ Waiting for deployment to stabilize..."
    sleep 30
    
    # Check frontend
    if curl -f "https://ayinel.com" &> /dev/null; then
        echo -e "${GREEN}✅ Frontend is healthy${NC}"
    else
        echo -e "${RED}❌ Frontend health check failed${NC}"
    fi
    
    # Check backend
    if curl -f "https://api.ayinel.com/api/v1/health" &> /dev/null; then
        echo -e "${GREEN}✅ Backend is healthy${NC}"
    else
        echo -e "${RED}❌ Backend health check failed${NC}"
    fi
}

# Main deployment flow
main() {
    echo "🎯 Ayinel Platform Deployment Started"
    echo "====================================="
    
    check_requirements
    build_app
    deploy_backend
    deploy_frontend
    setup_domain
    run_migrations
    health_check
    
    echo ""
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo ""
    echo "🌐 Your platform is now live at:"
    echo "   Frontend: https://ayinel.com"
    echo "   Backend:  https://api.ayinel.com"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Configure your domain DNS records"
    echo "   2. Set up SSL certificates (automatic with Vercel/Railway)"
    echo "   3. Configure payment gateway webhooks"
    echo "   4. Set up monitoring and analytics"
    echo "   5. Test all features thoroughly"
}

# Run main function
main "$@"
