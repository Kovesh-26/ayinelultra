# Domain Setup Guide - ayinel.com

## Overview

This guide will help you set up your custom domain `ayinel.com` with Cloudflare Pages and ensure proper DNS configuration.

## Prerequisites

- ✅ Domain: ayinel.com (already owned)
- ✅ Cloudflare account with domain added
- ✅ Cloudflare Pages project created

## Step 1: Verify Domain in Cloudflare

1. **Login to Cloudflare Dashboard**
2. **Select ayinel.com** from your domains list
3. **Verify DNS records** are properly configured

## Step 2: DNS Configuration

### Primary DNS Records

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| A | @ | 192.0.2.1 | ✅ Proxied |
| CNAME | www | ayinel-web.pages.dev | ✅ Proxied |
| CNAME | api | your-api-domain.com | ✅ Proxied |
| CNAME | cdn | your-cdn-domain.com | ✅ Proxied |

### Additional Records

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| TXT | @ | v=spf1 include:_spf.google.com ~all | ❌ DNS Only |
| MX | @ | 1 aspmx.l.google.com | ❌ DNS Only |
| MX | @ | 5 alt1.aspmx.l.google.com | ❌ DNS Only |

## Step 3: Cloudflare Pages Domain Setup

### Connect Custom Domain

1. **Go to Cloudflare Pages Dashboard**
2. **Select your project**: ayinel-web
3. **Navigate to Custom domains**
4. **Click "Set up a custom domain"**
5. **Enter**: `ayinel.com`
6. **Click "Continue"**

### SSL/TLS Configuration

1. **Go to SSL/TLS settings**
2. **Set Encryption mode**: Full (strict)
3. **Enable "Always Use HTTPS"**
4. **Enable HSTS** (optional but recommended)

## Step 4: Page Rules Setup

### Performance Optimization

Create these page rules in Cloudflare:

#### Rule 1: Cache Static Assets
- **URL**: `ayinel.com/static/*`
- **Settings**:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 day
  - Browser Cache TTL: 1 week

#### Rule 2: API Routes
- **URL**: `ayinel.com/api/*`
- **Settings**:
  - Cache Level: Bypass
  - Security Level: High

#### Rule 3: Images and Media
- **URL**: `ayinel.com/images/*`
- **Settings**:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 week
  - Browser Cache TTL: 1 month

## Step 5: Security Settings

### Security Level
- **Set to**: Medium
- **For admin routes**: High

### WAF (Web Application Firewall)
- **Enable**: Managed Ruleset
- **Enable**: Rate Limiting
- **Enable**: Bot Fight Mode

### Rate Limiting Rules
- **API endpoints**: 100 requests/minute per IP
- **Login attempts**: 5 attempts/minute per IP
- **Upload endpoints**: 10 requests/minute per IP

## Step 6: Performance Optimization

### Speed Settings
- **Auto Minify**: JavaScript, CSS, HTML
- **Brotli**: Enabled
- **Rocket Loader**: Enabled
- **Early Hints**: Enabled

### Caching
- **Browser Cache TTL**: 4 hours
- **Edge Cache TTL**: 2 hours
- **Always Online**: Enabled

## Step 7: Analytics and Monitoring

### Enable Analytics
1. **Go to Analytics tab**
2. **Enable Web Analytics**
3. **Enable Real User Monitoring**

### Set up Alerts
1. **Go to Notifications**
2. **Create alerts for**:
   - High error rates
   - Performance degradation
   - Security threats

## Step 8: Email Configuration (Optional)

### Google Workspace Setup
1. **Add MX records** (see DNS configuration above)
2. **Add SPF record** (see DNS configuration above)
3. **Add DKIM records** (provided by Google)
4. **Add DMARC record**:
   ```
   Type: TXT
   Name: _dmarc
   Content: v=DMARC1; p=quarantine; rua=mailto:dmarc@ayinel.com
   ```

## Step 9: Testing

### Domain Verification
1. **Visit**: https://ayinel.com
2. **Verify**: Site loads correctly
3. **Check**: HTTPS redirect works
4. **Test**: All pages accessible

### Performance Testing
1. **Use**: Google PageSpeed Insights
2. **Target**: 90+ score
3. **Test**: Mobile and desktop

### Security Testing
1. **SSL Labs**: A+ rating
2. **Security Headers**: Properly configured
3. **WAF**: Blocking malicious requests

## Step 10: Monitoring

### Set up Monitoring
1. **Uptime monitoring**: Pingdom or UptimeRobot
2. **Performance monitoring**: Cloudflare Analytics
3. **Error tracking**: Sentry or similar
4. **Security monitoring**: Cloudflare Security Center

### Regular Maintenance
- **Weekly**: Check analytics and performance
- **Monthly**: Review security settings
- **Quarterly**: Update SSL certificates
- **Annually**: Review DNS configuration

## Troubleshooting

### Common Issues

#### Domain Not Loading
- Check DNS propagation (24-48 hours)
- Verify Cloudflare proxy is enabled
- Check SSL certificate status

#### SSL Issues
- Ensure "Always Use HTTPS" is enabled
- Check SSL/TLS encryption mode
- Verify certificate is valid

#### Performance Issues
- Enable Cloudflare's CDN
- Check page rules configuration
- Optimize images and assets

#### Email Issues
- Verify MX records are correct
- Check SPF record configuration
- Test email delivery

## Support Resources

- **Cloudflare Help Center**: https://support.cloudflare.com/
- **Cloudflare Community**: https://community.cloudflare.com/
- **DNS Checker**: https://dnschecker.org/
- **SSL Labs**: https://www.ssllabs.com/ssltest/

## Final Checklist

- [ ] Domain loads at https://ayinel.com
- [ ] HTTPS redirects working
- [ ] DNS records properly configured
- [ ] SSL certificate valid
- [ ] Page rules active
- [ ] Security settings configured
- [ ] Analytics enabled
- [ ] Performance optimized
- [ ] Monitoring set up
- [ ] Email working (if configured)
