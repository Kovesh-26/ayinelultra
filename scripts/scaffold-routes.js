const fs = require('fs');
const path = require('path');

// AYINEL Platform Routes Configuration
const routes = {
  // Public/Marketing (10)
  'public': [
    '/',
    '/explore',
    '/trending', 
    '/live',
    '/music',
    '/videos',
    '/search',
    '/about',
    '/contact',
    '/for-you'
  ],
  
  // Auth/Onboarding (6)
  'auth': [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/onboarding'
  ],
  
  // Viewer Content (10)
  'viewer': [
    '/watch/[id]',
    '/flip/[id]',
    '/music/[id]',
    '/collection/[id]',
    '/studio/[handle]',
    '/studio/[handle]/about',
    '/studio/[handle]/videos',
    '/studio/[handle]/music',
    '/studio/[handle]/live',
    '/studio/[handle]/community'
  ],
  
  // User Area (9)
  'user': [
    '/dashboard',
    '/profile',
    '/profile/edit',
    '/notifications',
    '/messages',
    '/messages/[threadId]',
    '/subscriptions',
    '/collections',
    '/history'
  ],
  
  // Create/Upload (5)
  'create': [
    '/create',
    '/upload/video',
    '/upload/music',
    '/go-live',
    '/drafts'
  ],
  
  // Creator Studio (18)
  'studio': [
    '/studio/me',
    '/studio/me/content',
    '/studio/me/content/videos',
    '/studio/me/content/music',
    '/studio/me/live',
    '/studio/me/analytics',
    '/studio/me/monetization',
    '/studio/me/memberships',
    '/studio/me/store',
    '/studio/me/payouts',
    '/studio/me/community',
    '/studio/me/comments',
    '/studio/me/collections',
    '/studio/me/settings',
    '/studio/me/settings/branding',
    '/studio/me/settings/links',
    '/studio/me/settings/permissions',
    '/studio/me/settings/advanced'
  ],
  
  // Community/Social (6)
  'community': [
    '/community',
    '/community/[topic]',
    '/rooms',
    '/rooms/[id]',
    '/reports/new',
    '/appeals/new'
  ],
  
  // Help/Docs (7)
  'help': [
    '/help',
    '/help/get-started',
    '/help/creators',
    '/help/viewers',
    '/help/policy',
    '/help/contact-support',
    '/status'
  ],
  
  // Legal (6)
  'legal': [
    '/terms',
    '/privacy',
    '/cookies',
    '/community-guidelines',
    '/copyright',
    '/brand'
  ],
  
  // Admin (5)
  'admin': [
    '/admin',
    '/admin/users',
    '/admin/content',
    '/admin/moderation',
    '/admin/payments'
  ]
};

// Default page template
const pageTemplate = `import React from 'react';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">
          AYINEL Platform
        </h1>
        <p className="text-gray-300">
          This page is under construction. Welcome to the next-gen creator platform!
        </p>
      </div>
    </div>
  );
}
`;

// Layout template
const layoutTemplate = `import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AYINEL - Next-gen Creator Platform',
  description: 'Blending YouTube, Facebook, and MySpace for the ultimate creator experience',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
`;

// Global CSS template
const globalCSSTemplate = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 255, 255, 255;
  --background-start-rgb: 0, 0, 0;
  --background-end-rgb: 0, 0, 0;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}

/* AYINEL Brand Colors */
.ayinel-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.ayinel-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
`;

function createDirectoryIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

function createPageFile(filePath, content) {
  const dir = path.dirname(filePath);
  createDirectoryIfNotExists(dir);
  
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`📄 Created page: ${filePath}`);
  } else {
    console.log(`⚠️  Page already exists: ${filePath}`);
  }
}

function scaffoldRoutes() {
  console.log('🚀 Scaffolding AYINEL Platform Routes...\n');
  
  const webAppPath = path.join(__dirname, '..', 'apps', 'web', 'src', 'app');
  
  // Create main layout and global CSS
  createPageFile(path.join(webAppPath, 'layout.tsx'), layoutTemplate);
  createPageFile(path.join(webAppPath, 'globals.css'), globalCSSTemplate);
  
  // Create all routes
  Object.entries(routes).forEach(([category, routeList]) => {
    console.log(`\n📂 Creating ${category} routes...`);
    
    routeList.forEach(route => {
      const routePath = route.replace(/\[.*?\]/g, 'dynamic');
      const filePath = path.join(webAppPath, routePath, 'page.tsx');
      
      // Customize template based on route
      let customTemplate = pageTemplate;
      
      if (route === '/') {
        customTemplate = `import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="ayinel-gradient min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-6">
            AYINEL
          </h1>
          <p className="text-xl mb-8">
            Next-gen Creator Platform
          </p>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Blending YouTube, Facebook, and MySpace for the ultimate creator experience.
            Join the revolution in content creation and community building.
          </p>
          <div className="mt-8 space-x-4">
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Get Started
            </button>
            <button className="ayinel-glass px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-20 transition">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`;
      }
      
      createPageFile(filePath, customTemplate);
    });
  });
  
  console.log('\n✅ Route scaffolding completed!');
  console.log(`📊 Total routes created: ${Object.values(routes).flat().length}`);
  console.log('\n🎯 Next steps:');
  console.log('1. Run: pnpm install');
  console.log('2. Run: pnpm db:migrate');
  console.log('3. Run: pnpm dev');
  console.log('\n🌐 Access your app at: http://localhost:3000');
}

// Run the scaffolder
if (require.main === module) {
  scaffoldRoutes();
}

module.exports = { scaffoldRoutes, routes };
