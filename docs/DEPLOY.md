# 🚀 **AYINEL LINODE VPS DEPLOYMENT GUIDE**

## 📋 **OVERVIEW**

This guide walks you through deploying the Ayinel platform on a Linode VPS using the universal installer script. The process is automated and takes about 15-20 minutes from start to finish.

## 🖥️ **LINODE VPS SETUP**

### **Step 1: Create Linode Instance**

1. **Login to Linode Cloud Manager**
   - Go to [cloud.linode.com](https://cloud.linode.com)
   - Sign in to your account

2. **Create New Linode**
   - Click **"Create Linode"**
   - Choose **"Linode"** as the product

3. **Choose Distribution**
   - **Image**: `Ubuntu 22.04 LTS`
   - **Region**: Choose closest to your users
   - **Linode Plan**: `Nanode 1 GB` (minimum) or `Linode 2 GB` (recommended)

4. **Configure Instance**
   - **Label**: `ayinel-production`
   - **Root Password**: Generate a strong password
   - **SSH Key**: Add your SSH key for secure access

5. **Create Linode**
   - Click **"Create Linode"**
   - Wait for provisioning (2-3 minutes)

### **Step 2: Access Your Linode**

```bash
# SSH to your Linode (replace with your IP)
ssh root@YOUR_LINODE_IP

# Update system packages
apt update && apt upgrade -y

# Install basic tools
apt install -y curl wget git htop
```

### **Step 3: Add Swap Memory (if needed)**

For smaller instances (1GB RAM), add swap:

```bash
# Check current memory
free -h

# Add 2GB swap file
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Verify swap
free -h
```

## 🌐 **DNS CONFIGURATION**

### **Step 1: Get Your Linode IP**

```bash
# Get your public IP
curl -s ifconfig.me
# or
ip addr show eth0 | grep inet
```

### **Step 2: Configure DNS Records**

**In your domain registrar (GoDaddy, Namecheap, etc.):**

1. **Go to DNS Management**
2. **Add these records:**

```
Type    Name               Value               TTL
A       @                  YOUR_LINODE_IP      300
A       api                YOUR_LINODE_IP      300
CNAME   www                ayinel.com          300
```

**Example with IP 192.168.1.100:**
```
Type    Name               Value               TTL
A       @                  192.168.1.100      300
A       api                192.168.1.100      300
CNAME   www                ayinel.com          300
```

### **Step 3: Verify DNS Propagation**

```bash
# Check if DNS is pointing to your server
nslookup ayinel.com
nslookup api.ayinel.com
nslookup www.ayinel.com
```

**Wait 5-15 minutes for DNS to propagate globally.**

## 🚀 **DEPLOYMENT WITH UNIVERSAL INSTALLER**

### **Step 1: Download the Installer**

```bash
# Download the universal installer
curl -O https://raw.githubusercontent.com/Kovesh-26/ayinelultra/main/ayinel_install.sh

# Make it executable
chmod +x ayinel_install.sh

# Verify the script
head -20 ayinel_install.sh
```

### **Step 2: Run the Installer**

```bash
# Deploy everything on one server
sudo bash ayinel_install.sh \
  --mode single \
  --domain-web ayinel.com \
  --domain-api api.ayinel.com \
  --email your-email@ayinel.com
```

**What happens during installation:**
- ✅ System dependencies installed (Node.js, pnpm, PM2, Nginx, PostgreSQL)
- ✅ Code cloned from GitHub repository
- ✅ Database created and configured
- ✅ Applications built and deployed
- ✅ Nginx reverse proxy configured
- ✅ SSL certificates requested
- ✅ Services started with PM2

**Installation time: 10-15 minutes**

### **Step 3: Monitor Installation Progress**

```bash
# Watch the installation logs
tail -f /var/log/syslog

# Check system resources
htop

# Monitor disk usage
df -h
```

## 🔍 **VERIFICATION & TESTING**

### **Step 1: Check Service Status**

```bash
# Check PM2 processes
pm2 status

# Check Nginx
systemctl status nginx

# Check PostgreSQL
systemctl status postgresql

# Check firewall
ufw status
```

### **Step 2: Test Endpoints**

```bash
# Test frontend
curl -I https://ayinel.com

# Test API
curl -I https://api.ayinel.com/api/v1/health

# Test local services
curl http://localhost:3000
curl http://localhost:3001/api/v1/health
```

### **Step 3: Check SSL Certificates**

```bash
# Check certificate status
certbot certificates

# Test SSL configuration
curl -I https://ayinel.com
curl -I https://api.ayinel.com
```

## 🚨 **TROUBLESHOOTING**

### **SSL Certificate Issues**

If SSL fails during installation:

```bash
# Check DNS propagation
nslookup ayinel.com
nslookup api.ayinel.com

# Re-run SSL setup
certbot --nginx -d ayinel.com,www.ayinel.com --agree-tos
certbot --nginx -d api.ayinel.com --agree-tos

# Check Nginx configuration
nginx -t
systemctl reload nginx
```

### **Service Startup Issues**

```bash
# Check PM2 logs
pm2 logs ayinel-web
pm2 logs ayinel-api

# Check environment files
cat ~/ayinel/apps/api/.env
cat ~/ayinel/apps/web/.env.local

# Restart services
pm2 restart all
```

### **Database Connection Issues**

```bash
# Check PostgreSQL status
systemctl status postgresql

# Test database connection
sudo -u postgres psql -d ayineldb -c "SELECT 1;"

# Check database credentials
grep DATABASE_URL ~/ayinel/apps/api/.env
```

### **Port Conflicts**

```bash
# Check what's using the ports
netstat -tlnp | grep :3000
netstat -tlnp | grep :3001

# Kill conflicting processes
sudo kill -9 <PID>
```

## 🛠️ **MANAGEMENT & MAINTENANCE**

### **Daily Operations**

```bash
# Check service status
pm2 status

# View logs
pm2 logs

# Monitor system resources
htop
df -h
free -h
```

### **Updating Your Platform**

```bash
# Pull latest code
cd ~/ayinel
git pull origin main

# Re-run installer (safe, updates everything)
sudo bash ayinel_install.sh \
  --mode single \
  --domain-web ayinel.com \
  --domain-api api.ayinel.com \
  --email your-email@ayinel.com
```

### **Backup Database**

```bash
# Create backup
sudo -u postgres pg_dump ayineldb > ~/ayinel_backup_$(date +%Y%m%d_%H%M%S).sql

# List backups
ls -la ~/ayinel_backup_*.sql
```

### **Monitoring & Logs**

```bash
# Application logs
pm2 logs ayinel-web --lines 100
pm2 logs ayinel-api --lines 100

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System logs
journalctl -u nginx -f
journalctl -u postgresql -f
```

## 🔐 **SECURITY FEATURES**

### **Automatic Security Setup**

The installer automatically configures:

- ✅ **UFW Firewall**: Only SSH, HTTP, HTTPS ports open
- ✅ **SSL Certificates**: Let's Encrypt with auto-renewal
- ✅ **Secure Passwords**: Auto-generated database and JWT secrets
- ✅ **File Permissions**: Proper ownership and access controls
- ✅ **Service Isolation**: Each service runs with appropriate user

### **Additional Security Recommendations**

```bash
# Change SSH port (optional)
sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config
systemctl restart sshd

# Set up fail2ban (optional)
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban

# Regular security updates
apt update && apt upgrade -y
```

## 📊 **PERFORMANCE MONITORING**

### **System Resources**

```bash
# Real-time monitoring
htop

# Disk usage
df -h

# Memory usage
free -h

# Network connections
netstat -tlnp
```

### **Application Metrics**

```bash
# PM2 monitoring
pm2 monit

# Process status
pm2 status

# Resource usage
pm2 show ayinel-web
pm2 show ayinel-api
```

## 🎯 **POST-DEPLOYMENT CHECKLIST**

- [ ] **Frontend**: Accessible at `https://ayinel.com`
- [ ] **API**: Accessible at `https://api.ayinel.com`
- [ ] **SSL**: Green lock in browser
- [ ] **Services**: PM2 shows all services online
- [ ] **Database**: Migrations completed successfully
- [ ] **Health Checks**: API endpoints responding
- [ ] **Firewall**: UFW enabled and configured
- [ ] **Logs**: Logs being generated
- [ ] **PM2 Startup**: Services auto-start on reboot

## 🎉 **SUCCESS!**

Once everything is working, you'll see:

```
================= AYINEL READY ✅ =================
Mode:          single
Code:          /home/user/ayinel
User:          user

Web:
  Domain:      ayinel.com www.ayinel.com
  Local port:  3000
API:
  Domain:      api.ayinel.com
  Local port:  3001

Database (if provisioned):
  Name:        ayineldb
  User:        ayinel
  Pass:        [auto-generated]
===================================================
```

## 🆘 **SUPPORT & RESOURCES**

### **Documentation**
- [Ayinel Platform Documentation](../README.md)
- [Linode Documentation](https://www.linode.com/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

### **Community**
- GitHub Issues: [Report bugs or request features](https://github.com/Kovesh-26/ayinelultra/issues)
- Linode Community: [Get help with VPS issues](https://www.linode.com/community/)

### **Useful Commands Reference**

```bash
# Service management
pm2 status                    # Check status
pm2 restart all              # Restart all
pm2 reload all               # Zero-downtime reload
pm2 logs                     # View logs
pm2 monit                    # Monitor

# Nginx management
nginx -t                     # Test config
systemctl reload nginx       # Reload
systemctl restart nginx      # Restart

# Database management
sudo -u postgres psql -d ayineldb    # Connect
sudo -u postgres pg_dump ayineldb > backup.sql    # Backup

# SSL management
certbot certificates         # Check status
certbot renew               # Renew manually
```

---

**🎯 Your Ayinel platform is now live on Linode!**

For any issues, check the troubleshooting section above or review the logs using the management commands.
