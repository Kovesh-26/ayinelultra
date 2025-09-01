# 🚀 **AYINEL PLATFORM - COMPLETE DEPLOYMENT GUIDE**

## 📋 **OVERVIEW**

This guide provides step-by-step instructions for deploying the Ayinel platform to production. The platform includes:

- **Frontend**: Next.js web application
- **Backend**: NestJS API server
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Web Server**: Nginx with SSL
- **Process Management**: PM2
- **Monitoring**: Built-in health checks

## 🎯 **DEPLOYMENT OPTIONS**

### **Option 1: Complete Fresh Deployment**
Use when setting up a new server from scratch.

### **Option 2: Quick Setup**
Use when files are already migrated to the server.

### **Option 3: File Migration + Setup**
Use when you need to migrate files first, then set up.

## 🖥️ **SERVER REQUIREMENTS**

### **Minimum Specifications**
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **OS**: Ubuntu 20.04+ or Debian 11+

### **Recommended Specifications**
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 50GB+ SSD
- **OS**: Ubuntu 22.04 LTS

### **Network Requirements**
- **Ports**: 22 (SSH), 80 (HTTP), 443 (HTTPS)
- **Domain**: `ayinel.com` and `api.ayinel.com`
- **SSL**: Let's Encrypt certificates

## 📦 **DEPLOYMENT SCRIPTS**

### **1. Complete Production Deployment**
```bash
# Make script executable
chmod +x scripts/deploy-production.sh

# Run complete deployment
sudo ./scripts/deploy-production.sh
```

**What it does:**
- Updates system packages
- Installs all dependencies (Node.js, pnpm, PM2)
- Sets up Nginx web server
- Installs and configures PostgreSQL
- Installs and configures Redis
- Sets up SSL certificates
- Configures firewall
- Sets up monitoring and backup
- Installs application dependencies
- Builds applications
- Sets up PM2 process management

### **2. Quick Setup (Files Already Migrated)**
```bash
# Make script executable
chmod +x scripts/quick-setup.sh

# Run quick setup
sudo ./scripts/quick-setup.sh
```

**What it does:**
- Installs application dependencies
- Sets up environment variables
- Runs database migrations
- Configures PM2 process management
- Sets up Nginx configuration
- Performs health checks

### **3. File Migration + Setup**
```bash
# Make script executable
chmod +x scripts/migrate-files.sh

# Migrate files first
sudo ./scripts/migrate-files.sh

# Then run quick setup
sudo ./scripts/quick-setup.sh
```

**What it does:**
- Creates backup of existing installation
- Migrates all files to `/var/www/ayinel`
- Sets up environment variables
- Installs dependencies
- Builds applications
- Sets up database schema

## 🔧 **MANUAL SETUP STEPS**

If you prefer to set up manually or need to troubleshoot:

### **Step 1: System Preparation**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip software-properties-common \
                   apt-transport-https ca-certificates gnupg lsb-release \
                   build-essential python3 python3-pip
```

### **Step 2: Install Node.js and pnpm**
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt install -y nodejs

# Install pnpm
sudo npm install -g pnpm

# Install PM2
sudo npm install -g pm2
```

### **Step 3: Install and Configure PostgreSQL**
```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE ayinel_prod;
CREATE USER ayinel_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE ayinel_prod TO ayinel_user;
ALTER USER ayinel_user CREATEDB;
\q
EOF
```

### **Step 4: Install and Configure Redis**
```bash
# Install Redis
sudo apt install -y redis-server

# Configure Redis with password
sudo sed -i 's/# requirepass foobared/requirepass your_redis_password/' /etc/redis/redis.conf

# Start and enable Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### **Step 5: Install and Configure Nginx**
```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/ayinel

# Enable site
sudo ln -sf /etc/nginx/sites-available/ayinel /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
sudo systemctl enable nginx
```

### **Step 6: Setup SSL Certificates**
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificates
sudo certbot --nginx -d ayinel.com -d www.ayinel.com --non-interactive --agree-tos --email admin@ayinel.com
sudo certbot --nginx -d api.ayinel.com --non-interactive --agree-tos --email admin@ayinel.com

# Setup auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### **Step 7: Application Setup**
```bash
# Create application directory
sudo mkdir -p /var/www/ayinel
sudo mkdir -p /var/www/ayinel/uploads
sudo mkdir -p /var/www/ayinel/logs

# Set permissions
sudo chown -R www-data:www-data /var/www/ayinel
sudo chmod -R 755 /var/www/ayinel

# Navigate to application directory
cd /var/www/ayinel

# Install dependencies
pnpm install

# Build applications
pnpm --filter @ayinel/web build
pnpm --filter @ayinel/api build
```

### **Step 8: Environment Configuration**
```bash
# Create environment file
sudo nano /var/www/ayinel/.env
```

**Environment Variables:**
```env
NODE_ENV=production
DATABASE_URL="postgresql://ayinel_user:your_password@localhost:5432/ayinel_prod?schema=public"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="https://ayinel.com,https://www.ayinel.com,https://api.ayinel.com"
REDIS_URL="redis://:your_redis_password@localhost:6379"
MAX_FILE_SIZE=104857600
UPLOAD_PATH="/var/www/ayinel/uploads"
PORT=3001
HOST=0.0.0.0
DOMAIN="ayinel.com"
API_URL="https://api.ayinel.com"
WEB_URL="https://ayinel.com"
```

### **Step 9: Database Setup**
```bash
# Navigate to API directory
cd /var/www/ayinel/apps/api

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### **Step 10: PM2 Process Management**
```bash
# Navigate to application directory
cd /var/www/ayinel

# Create PM2 ecosystem file
nano ecosystem.config.js
```

**PM2 Configuration:**
```javascript
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
```

```bash
# Start applications
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔍 **VERIFICATION & TESTING**

### **Health Checks**
```bash
# Check PM2 status
pm2 status

# Check application logs
pm2 logs

# Check Nginx status
sudo systemctl status nginx

# Check PostgreSQL status
sudo systemctl status postgresql

# Check Redis status
sudo systemctl status redis-server
```

### **Test Endpoints**
```bash
# Test frontend
curl http://localhost:3000

# Test API health
curl http://localhost:3001/api/v1/health

# Test database connection
sudo -u postgres psql -d ayinel_prod -c "SELECT 1;"

# Test Redis connection
redis-cli -a your_redis_password ping
```

## 🛠️ **MANAGEMENT COMMANDS**

### **Application Management**
```bash
# PM2 commands
pm2 status          # Check status
pm2 logs            # View logs
pm2 restart all     # Restart all apps
pm2 stop all        # Stop all apps
pm2 start all       # Start all apps
pm2 reload all      # Zero-downtime reload

# Nginx commands
sudo systemctl status nginx    # Check status
sudo systemctl reload nginx    # Reload configuration
sudo systemctl restart nginx   # Restart service
sudo nginx -t                  # Test configuration

# Database commands
sudo systemctl status postgresql    # Check status
sudo systemctl restart postgresql   # Restart service
sudo -u postgres psql -d ayinel_prod    # Connect to database
```

### **Log Management**
```bash
# View application logs
pm2 logs

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# View system logs
sudo journalctl -u nginx -f
sudo journalctl -u postgresql -f
sudo journalctl -u redis-server -f
```

### **Backup and Restore**
```bash
# Manual backup
sudo /var/www/ayinel/scripts/backup.sh

# Database backup only
sudo -u postgres pg_dump ayinel_prod > backup.sql

# Database restore
sudo -u postgres psql -d ayinel_prod < backup.sql
```

## 🔐 **SECURITY CONSIDERATIONS**

### **Firewall Configuration**
```bash
# Install UFW
sudo apt install -y ufw

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw allow 3001

# Enable firewall
sudo ufw --force enable
```

### **SSL Configuration**
- Let's Encrypt certificates auto-renew
- HTTP to HTTPS redirects
- Security headers configured
- HSTS enabled

### **File Permissions**
- Application files: 755
- Environment file: 600
- Uploads directory: 755
- Logs directory: 755

## 📊 **MONITORING & MAINTENANCE**

### **Performance Monitoring**
```bash
# System resources
htop
iotop
nethogs

# Application metrics
pm2 monit
pm2 status
```

### **Log Rotation**
- Automatic log rotation configured
- Logs compressed after rotation
- 52 weeks of log retention
- PM2 log reload after rotation

### **Backup Schedule**
- Daily automated backups at 2 AM
- Database, application, and uploads backed up
- 7 days of backup retention
- Backup location: `/var/backups/ayinel`

## 🚨 **TROUBLESHOOTING**

### **Common Issues**

#### **Application Not Starting**
```bash
# Check PM2 logs
pm2 logs

# Check environment variables
cat /var/www/ayinel/.env

# Check file permissions
ls -la /var/www/ayinel/
```

#### **Database Connection Issues**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check database connection
sudo -u postgres psql -d ayinel_prod -c "SELECT 1;"

# Check environment variables
grep DATABASE_URL /var/www/ayinel/.env
```

#### **Nginx Configuration Issues**
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Check site configuration
sudo cat /etc/nginx/sites-enabled/ayinel
```

#### **SSL Certificate Issues**
```bash
# Check certificate status
sudo certbot certificates

# Renew certificates manually
sudo certbot renew

# Check certificate files
sudo ls -la /etc/letsencrypt/live/ayinel.com/
```

## 📋 **POST-DEPLOYMENT CHECKLIST**

- [ ] Frontend accessible at `https://ayinel.com`
- [ ] API accessible at `https://api.ayinel.com`
- [ ] SSL certificates working
- [ ] Database migrations completed
- [ ] All services running (PM2, Nginx, PostgreSQL, Redis)
- [ ] Health check endpoints responding
- [ ] File uploads working
- [ ] Payment gateway webhooks configured
- [ ] Monitoring and alerts set up
- [ ] Backup system working
- [ ] Firewall configured
- [ ] Domain DNS configured

## 🆘 **SUPPORT & RESOURCES**

### **Documentation**
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)

### **Logs and Debugging**
- Application logs: `pm2 logs`
- Nginx logs: `/var/log/nginx/`
- System logs: `journalctl`
- PM2 logs: `/var/www/ayinel/logs/`

### **Emergency Contacts**
- Server provider support
- Domain registrar support
- SSL certificate provider (Let's Encrypt)

---

**🎉 Your Ayinel platform is now ready for production!**

For any issues or questions, check the logs and use the troubleshooting section above.
