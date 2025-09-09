#!/usr/bin/env node

/**
 * Test script for DNS blocking mitigation
 * Verifies that the postinstall script creates the necessary files and configurations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧪 Testing DNS blocking mitigation...');

const tests = [
  {
    name: 'Postinstall script exists',
    test: () => fs.existsSync(path.join(__dirname, 'postinstall.js'))
  },
  {
    name: 'Binaries.prisma.sh script created',
    test: () => fs.existsSync(path.join(__dirname, 'binaries.prisma.sh'))
  },
  {
    name: 'Binaries.prisma.sh is executable',
    test: () => {
      const stats = fs.statSync(path.join(__dirname, 'binaries.prisma.sh'));
      return (stats.mode & parseInt('755', 8)) !== 0;
    }
  },
  {
    name: 'Font fallback CSS created',
    test: () => fs.existsSync(path.join(__dirname, '../public/fonts/fallback.css'))
  },
  {
    name: 'Prisma environment variables set',
    test: () => {
      const envPath = path.join(__dirname, '../.env');
      if (!fs.existsSync(envPath)) return false;
      const content = fs.readFileSync(envPath, 'utf8');
      return content.includes('PRISMA_QUERY_ENGINE_BINARY') && 
             content.includes('PRISMA_CLI_BINARY_TARGETS');
    }
  },
  {
    name: 'Package.json has postinstall script',
    test: () => {
      const pkgPath = path.join(__dirname, '../package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      return pkg.scripts && pkg.scripts.postinstall === 'node scripts/postinstall.js';
    }
  }
];

let passed = 0;
let failed = 0;

console.log('\n📋 Running tests...\n');

tests.forEach(test => {
  try {
    if (test.test()) {
      console.log(`✅ ${test.name}`);
      passed++;
    } else {
      console.log(`❌ ${test.name}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${test.name} - Error: ${error.message}`);
    failed++;
  }
});

console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('🎉 All tests passed! DNS blocking mitigation is properly configured.');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please check the configuration.');
  process.exit(1);
}