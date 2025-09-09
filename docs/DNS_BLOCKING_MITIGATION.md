# DNS Blocking Mitigation

This document describes the DNS blocking mitigation system implemented in Ayinel to handle restricted network environments where certain domains may be blocked or inaccessible.

## Overview

The DNS blocking mitigation system automatically detects and handles network restrictions that could prevent the proper installation and operation of the Ayinel platform. It specifically addresses issues with:

- Prisma binary downloads from `binaries.prisma.sh`
- Google Fonts access from `fonts.googleapis.com`
- Other CDN and external resource dependencies

## Components

### 1. Postinstall Script (`scripts/postinstall.js`)

The main script that runs automatically after package installation via the `postinstall` npm hook.

**Features:**
- Tests accessibility of critical domains
- Configures fallback mechanisms when domains are blocked
- Creates necessary configuration files and environment variables
- Provides detailed logging for troubleshooting

**Usage:**
```bash
# Runs automatically after installation
npm install

# Manual execution
npm run postinstall
# or
node scripts/postinstall.js
```

### 2. Prisma Binaries Configuration (`scripts/binaries.prisma.sh`)

An executable shell script that handles Prisma binary download issues in restricted environments.

**Features:**
- Tests multiple mirror sources for Prisma binaries
- Configures environment variables for offline/restricted setups
- Provides fallback to bundled binaries when downloads fail

**Usage:**
```bash
# Execute the script to configure Prisma binaries
bash scripts/binaries.prisma.sh

# Source the script to export environment variables
source scripts/binaries.prisma.sh
```

### 3. Font Fallback System (`public/fonts/fallback.css`)

CSS definitions for font fallbacks when Google Fonts is inaccessible.

**Features:**
- Local font alternatives for common Google Fonts
- Alternative CDN sources (fonts.gstatic.com)
- CSS variables for easy font management

**Usage in web applications:**
```html
<link rel="stylesheet" href="/fonts/fallback.css">
```

```css
/* Use predefined font variables */
body {
  font-family: var(--font-primary);
}
```

### 4. Environment Configuration

The system automatically configures environment variables in `.env`:

```bash
# Prisma binary configurations
PRISMA_QUERY_ENGINE_BINARY=./node_modules/@prisma/engines/query-engine-debian-openssl-3.0.x
PRISMA_MIGRATION_ENGINE_BINARY=./node_modules/@prisma/engines/migration-engine-debian-openssl-3.0.x
PRISMA_INTROSPECTION_ENGINE_BINARY=./node_modules/@prisma/engines/introspection-engine-debian-openssl-3.0.x
PRISMA_FMT_BINARY=./node_modules/@prisma/engines/prisma-fmt-debian-openssl-3.0.x
PRISMA_CLI_BINARY_TARGETS=native,debian-openssl-1.1.x,debian-openssl-3.0.x
```

## Testing

Run the test suite to verify the mitigation system:

```bash
node scripts/test-dns-mitigation.js
```

The test suite verifies:
- All required files are created
- Scripts have correct permissions
- Configuration is properly set
- Package.json integration is working

## Troubleshooting

### Common Issues

1. **Prisma binaries fail to download**
   - The system will automatically configure local binary paths
   - Check that `scripts/binaries.prisma.sh` was created and is executable
   - Verify environment variables in `.env`

2. **Google Fonts not loading**
   - Font fallbacks are automatically configured in `public/fonts/fallback.css`
   - Include the fallback CSS in your web application
   - Use CSS variables for consistent font management

3. **Script fails during postinstall**
   - Check network connectivity to test domains
   - Review logs for specific error messages
   - The script is designed to fail gracefully without breaking installation

### Manual Configuration

If automatic configuration fails, you can manually set environment variables:

```bash
export PRISMA_SKIP_POSTINSTALL_GENERATE=true
export PRISMA_ENGINES_MIRROR="https://github.com/prisma/prisma-engines/releases"
export PRISMA_CLI_BINARY_TARGETS="native"
```

### Logs and Debugging

The postinstall script provides detailed logging:
- ✅ indicates successful operations
- ❌ indicates blocked/failed operations
- ⚠️ indicates warnings or fallback usage

## Security Considerations

- The system only accesses known, safe mirror sources
- No sensitive data is transmitted or stored
- All configurations use relative paths when possible
- Scripts run with minimal required permissions

## Deployment

The DNS blocking mitigation system is designed to work in various environments:

- **Development**: Handles blocked domains during `npm install`
- **CI/CD**: Works with restricted build environments
- **Production**: Configures optimal fallbacks for runtime

The system automatically adapts to the network environment and configures appropriate fallbacks without manual intervention.