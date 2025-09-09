# Cloudflare Pages Deployment Guide

## Prerequisites

1. **Cloudflare Account** with Pages enabled
2. **Domain**: ayinel.com (already owned)
3. **GitHub Repository** with your code

## Step 1: Connect Repository

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Connect your GitHub repository
4. Select the repository: `ayinel/ayinel_cloudflare_v2`

## Step 2: Build Configuration

### Build Settings

- **Framework preset**: Next.js
- **Build command**: `npm run build:web`
- **Build output directory**: `.next`
- **Root directory**: `apps/web`

### Environment Variables

Add these environment variables in Cloudflare Pages:

#### Required Variables

```
NEXT_PUBLIC_API_URL=https://api.ayinel.com
NEXT_PUBLIC_BRAND_NAME=Ayinel
NEXT_PUBLIC_BRAND_WORDS=Channel→Studio,Subscribe→Join,Follow→Tune-In,Like→Boost,Comment→Chat,Playlist→Collection,Shorts→Flips,Live→Broadcast,Subscribers→Crew,Recommendations→For You Stream
NEXT_PUBLIC_LIVEKIT_URL=wss://your.livekit.host
```

#### Optional Variables

```
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## Step 3: Deploy

1. Click **Save and Deploy**
2. Wait for the build to complete
3. Your site will be available at: `https://ayinel-web.pages.dev`

## Step 4: Custom Domain Setup

1. In your Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `ayinel.com`
4. Click **Continue**
5. Update DNS settings as prompted

## Step 5: DNS Configuration

In your Cloudflare DNS settings for ayinel.com:

### For Root Domain (ayinel.com)

- **Type**: A
- **Name**: @
- **Content**: 192.0.2.1 (Cloudflare proxy)
- **Proxy status**: Proxied ✅

### For www Subdomain

- **Type**: CNAME
- **Name**: www
- **Content**: ayinel-web.pages.dev
- **Proxy status**: Proxied ✅

### For API Subdomain

- **Type**: CNAME
- **Name**: api
- **Content**: your-api-domain.com
- **Proxy status**: Proxied ✅

## Step 6: SSL/TLS Settings

1. Go to **SSL/TLS** settings
2. Set **Encryption mode** to: Full (strict)
3. Enable **Always Use HTTPS**
4. Enable **HSTS**

## Step 7: Page Rules (Optional)

Create page rules for better performance:

1. **URL**: `ayinel.com/*`
2. **Settings**:
   - Cache Level: Cache Everything
   - Edge Cache TTL: 4 hours
   - Browser Cache TTL: 1 hour

## Step 8: Environment-Specific Deployments

### Production

- **Branch**: `main`
- **Environment**: Production
- **Domain**: ayinel.com

### Staging

- **Branch**: `develop`
- **Environment**: Preview
- **Domain**: staging.ayinel.com

## Step 9: Monitoring

1. **Analytics**: Enable Pages Analytics
2. **Functions**: Monitor function invocations
3. **Performance**: Use Web Vitals monitoring

## Troubleshooting

### Build Failures

- Check build logs in Cloudflare Pages
- Verify all dependencies are installed
- Ensure environment variables are set correctly

### Domain Issues

- Verify DNS propagation (can take 24-48 hours)
- Check SSL certificate status
- Ensure domain is properly proxied through Cloudflare

### Performance Issues

- Enable Cloudflare's CDN
- Use image optimization
- Implement proper caching headers

## Post-Deployment Checklist

- [ ] Site loads at https://ayinel.com
- [ ] HTTPS redirects working
- [ ] API endpoints accessible
- [ ] Images and assets loading
- [ ] Analytics tracking
- [ ] Error monitoring active
- [ ] Performance metrics acceptable

## Support

For issues with Cloudflare Pages:

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Community](https://community.cloudflare.com/)
- [Cloudflare Support](https://support.cloudflare.com/)
