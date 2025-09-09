#!/bin/bash
# Prisma binaries configuration for DNS-blocked environments
# This script handles alternative download sources for Prisma binaries

set -e

PRISMA_BINARIES_MIRROR="${PRISMA_BINARIES_MIRROR:-binaries.prisma.sh}"
DOWNLOAD_TIMEOUT="${DOWNLOAD_TIMEOUT:-30}"

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

for mirror in "${MIRRORS[@]}"; do
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
