#!/usr/bin/env node

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Post-install script to handle DNS blocking issues
 * Addresses problems with Prisma binary downloads and Google Fonts access
 */

console.log('🔧 Running postinstall DNS blocking mitigation...');

// Configuration for known blocked domains and their alternatives
const DNS_ALTERNATIVES = {
  'binaries.prisma.sh': [
    'binaries.prisma.sh',
    // Alternative CDN endpoints for Prisma binaries
    'prisma-binaries.vercel.app',
    'github.com/prisma/prisma-engines/releases'
  ],
  'fonts.googleapis.com': [
    'fonts.googleapis.com',
    // Alternative font CDNs
    'fonts.gstatic.com',
    'fonts.google.com'
  ]
};

/**
 * Test if a domain is accessible via DNS/HTTP
 */
function testDomainAccess(domain, timeout = 5000) {
  return new Promise((resolve) => {
    const options = {
      hostname: domain,
      port: 443,
      path: '/',
      method: 'HEAD',
      timeout: timeout,
      headers: {
        'User-Agent': 'Ayinel-PostInstall-Check/1.0'
      }
    };

    const req = https.request(options, (res) => {
      resolve({ domain, accessible: res.statusCode < 400 });
    });

    req.on('error', () => {
      resolve({ domain, accessible: false });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ domain, accessible: false });
    });

    req.setTimeout(timeout);
    req.end();
  });
}

/**
 * Set environment variables for Prisma binary downloads
 */
function configurePrismaDownloads() {
  console.log('📦 Configuring Prisma binary downloads...');
  
  const prismaConfig = {
    // Use local binary storage to avoid repeated downloads
    PRISMA_QUERY_ENGINE_BINARY: './node_modules/@prisma/engines/query-engine-debian-openssl-3.0.x',
    PRISMA_MIGRATION_ENGINE_BINARY: './node_modules/@prisma/engines/migration-engine-debian-openssl-3.0.x',
    PRISMA_INTROSPECTION_ENGINE_BINARY: './node_modules/@prisma/engines/introspection-engine-debian-openssl-3.0.x',
    PRISMA_FMT_BINARY: './node_modules/@prisma/engines/prisma-fmt-debian-openssl-3.0.x',
    // Fallback to bundled binaries if download fails
    PRISMA_CLI_BINARY_TARGETS: 'native,debian-openssl-1.1.x,debian-openssl-3.0.x'
  };

  // Create .env file with Prisma configurations if it doesn't exist
  const envPath = path.join(process.cwd(), '.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Add Prisma configurations if not present
  Object.entries(prismaConfig).forEach(([key, value]) => {
    if (!envContent.includes(key)) {
      envContent += `\n${key}=${value}`;
    }
  });

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Prisma configurations added to .env');
}

/**
 * Create binaries.prisma.sh configuration script
 */
function createPrismaBinariesConfig() {
  console.log('🛠️  Creating binaries.prisma.sh configuration...');
  
  const configScript = `#!/bin/bash
# Prisma binaries configuration for DNS-blocked environments
# This script handles alternative download sources for Prisma binaries

set -e

PRISMA_BINARIES_MIRROR="\${PRISMA_BINARIES_MIRROR:-binaries.prisma.sh}"
DOWNLOAD_TIMEOUT="\${DOWNLOAD_TIMEOUT:-30}"

echo "🔄 Checking Prisma binaries availability..."

# Function to test URL accessibility
test_url() {
    local url="$1"
    if curl --max-time $DOWNLOAD_TIMEOUT --head --fail --silent "$url" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Alternative mirrors for Prisma binaries
MIRRORS=(
    "https://binaries.prisma.sh"
    "https://github.com/prisma/prisma-engines/releases"
)

ACCESSIBLE_MIRROR=""

for mirror in "\${MIRRORS[@]}"; do
    echo "Testing mirror: $mirror"
    if test_url "$mirror"; then
        ACCESSIBLE_MIRROR="$mirror"
        echo "✅ Found accessible mirror: $mirror"
        break
    else
        echo "❌ Mirror not accessible: $mirror"
    fi
done

if [ -z "$ACCESSIBLE_MIRROR" ]; then
    echo "⚠️  No accessible mirrors found. Using bundled binaries."
    export PRISMA_SKIP_POSTINSTALL_GENERATE=true
else
    echo "🎯 Using mirror: $ACCESSIBLE_MIRROR"
    export PRISMA_BINARIES_MIRROR="$ACCESSIBLE_MIRROR"
fi

# Export environment variables for the current session
export PRISMA_ENGINES_MIRROR="$ACCESSIBLE_MIRROR"
export PRISMA_CLI_BINARY_TARGETS="native"

echo "✅ Prisma binaries configuration complete"
`;

  const configPath = path.join(process.cwd(), 'scripts', 'binaries.prisma.sh');
  fs.writeFileSync(configPath, configScript, { mode: 0o755 });
  console.log('✅ Created binaries.prisma.sh configuration script');
}

/**
 * Configure font fallbacks for Google Fonts
 */
function configureFontFallbacks() {
  console.log('🔤 Configuring font fallbacks...');
  
  // Create a CSS file with font fallbacks
  const fontFallbackCSS = `
/* Font fallbacks for DNS-blocked environments */
/* This file provides local font alternatives when fonts.googleapis.com is blocked */

@font-face {
  font-family: 'Roboto-Fallback';
  src: local('Roboto'), local('Arial'), local('Helvetica'), sans-serif;
  font-display: swap;
}

@font-face {
  font-family: 'Inter-Fallback';
  src: local('Inter'), local('Arial'), local('Helvetica'), sans-serif;
  font-display: swap;
}

/* Alternative CDN sources */
@import url('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2');
@import url('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2');

/* CSS variables for easy font switching */
:root {
  --font-primary: 'Roboto', 'Roboto-Fallback', Arial, sans-serif;
  --font-secondary: 'Inter', 'Inter-Fallback', Arial, sans-serif;
}
`;

  const fontsDir = path.join(process.cwd(), 'public', 'fonts');
  if (!fs.existsSync(fontsDir)) {
    fs.mkdirSync(fontsDir, { recursive: true });
  }

  const fallbackPath = path.join(fontsDir, 'fallback.css');
  fs.writeFileSync(fallbackPath, fontFallbackCSS);
  console.log('✅ Font fallback CSS created');
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🚀 Starting DNS blocking mitigation checks...');

    // Test critical domains
    const domainTests = [];
    for (const [domain, alternatives] of Object.entries(DNS_ALTERNATIVES)) {
      domainTests.push(testDomainAccess(domain));
    }

    const results = await Promise.all(domainTests);
    
    // Log accessibility results
    results.forEach(result => {
      const status = result.accessible ? '✅' : '❌';
      console.log(`${status} ${result.domain}: ${result.accessible ? 'Accessible' : 'Blocked/Inaccessible'}`);
    });

    // Configure Prisma if binaries.prisma.sh is having issues
    const prismaResult = results.find(r => r.domain === 'binaries.prisma.sh');
    if (!prismaResult.accessible) {
      console.log('⚠️  Prisma binaries domain appears blocked, applying mitigations...');
      configurePrismaDownloads();
      createPrismaBinariesConfig();
    } else {
      console.log('✅ Prisma binaries domain accessible, creating backup configuration...');
      createPrismaBinariesConfig();
    }

    // Configure font fallbacks if Google Fonts is having issues
    const fontsResult = results.find(r => r.domain === 'fonts.googleapis.com');
    if (!fontsResult.accessible) {
      console.log('⚠️  Google Fonts domain appears blocked, applying font fallbacks...');
      configureFontFallbacks();
    } else {
      console.log('✅ Google Fonts accessible, creating backup fallbacks...');
      configureFontFallbacks();
    }

    console.log('🎉 Postinstall DNS mitigation completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during postinstall:', error.message);
    // Don't fail the install process, just log the error
    process.exit(0);
  }
}

// Run the main function
main();