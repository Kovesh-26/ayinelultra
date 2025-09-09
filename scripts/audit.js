const fs = require('fs');
const path = require('path');

const root = process.cwd();

const webExpected = [
  '/', 'watch/[id]', 'search', 'u/[handle]', 'studio/[handle]', 'studio/[handle]/collections/[id]', 'upload', 'kidzone',
  'pricing', 'legal/terms', 'legal/privacy', 'legal/dmca', 'support', 'auth/login', 'auth/verify', 'auth/callback/[provider]',
  'settings/profile', 'settings/kidzone', 'dashboard', 'dashboard/uploads', 'dashboard/uploads/new', 'dashboard/customize',
  'dashboard/memberships', 'dashboard/newsletters', 'dashboard/analytics', 'dashboard/studio', 'dashboard/collections',
  'dashboard/collections/[id]/edit', 'admin', 'admin/moderation', '404', '500',
  'trending','flips','music','broadcasts','categories','tags/[tag]','studios','studios/family-friendly','collections/[id]','history','library',
  'watch/[id]/clips','watch/[id]/captions','watch/[id]/chapters','watch/[id]/editor','series/[slug]','series/[slug]/[episode]',
  'friends','friends/requests','groups','groups/[id]','inbox','inbox/[threadId]','chat/[roomId]','settings/account','settings/security','settings/payments','settings/notifications','settings/privacy','settings/studio/branding','settings/studio/integrations','settings/store','settings/address','settings/tax','plus','store','store/cart','store/orders','store/orders/[id]','payouts','payouts/tax','memberships','memberships/manage','kidzone/studios','kidzone/approvals','kidzone/time','parent','parent/approvals','parent/pin','guidelines','help','help/articles','help/articles/[slug]','appeals','admin/queues','admin/reports','admin/appeals','admin/users','admin/studios','admin/media','admin/payments','admin/feature-flags','admin/kidzone','admin/newsletters','admin/search'
];

const apiExpected = ['auth','users','studios','media','collections','chat','kidsettings','payments','webhooks','newsletters','moderation','admin','search','store','payouts','tax','feature-flags','reports','appeals'];

function findFiles(dir, pattern, files = []) {
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        findFiles(fullPath, pattern, files);
      } else if (pattern.test(item)) {
        files.push(fullPath);
      }
    }
  } catch (e) {
    // Directory doesn't exist
  }
  return files;
}

function hasPage(route, files) {
  const page = route === '/' ? 'page.tsx' : path.join(route, 'page.tsx');
  return files.some(f => f.replace(/\\/g,'/').endsWith(page));
}

function hasApiModule(module, files) {
  return files.some(f => f.includes('/modules/'));
}

// Find web pages
const webFiles = findFiles(path.join(root, 'apps/web/src/app'), /page\.tsx$/);
const webFound = webExpected.map(r => ({ label: r, ok: hasPage(r, webFiles) }));

// Find API modules
const apiFiles = findFiles(path.join(root, 'apps/api/src/modules'), /\.(ts|tsx)$/);
const apiFound = apiExpected.map(m => ({ label: m, ok: hasApiModule(m, apiFiles) }));

// Find mobile screens
const mobileFiles = findFiles(path.join(root, 'apps/mobile/app'), /index\.tsx$/);
const mobileExpected = [
  'onboarding','login','verify','home','search','watch','chat','u/[handle]','studio/[handle]','collection/[id]','upload','kidzone','settings/profile','settings/kidzone','plus','tips','inbox','dm/[id]',
  'trending','flips','music','broadcasts','categories','tags/[tag]','studios','player/clips','player/captions','player/chapters','friends','friends/requests','groups','groups/[id]','chat/[roomId]','inbox/[threadId]','store','store/cart','orders','orders/[id]','payouts','settings/security','settings/payments','settings/notifications','settings/privacy','settings/studio/branding','settings/studio/integrations','parent','parent/approvals','parent/pin','admin/reports','admin/moderation','admin/appeals'
];
const mobileFound = mobileExpected.map(s => ({ label: s, ok: mobileFiles.some(f => f.includes(pp//)) }));

let md = '# GAP_REPORT — Ayinel\n\n';

function section(title, rows) {
  const found = rows.filter(r => r.ok).length;
  const total = rows.length;
  md += ##  (Found /)\n\n| Item | Status |\n|---|---|\n;
  for (const r of rows) {
    md += |  |  |\n;
  }
  md += '\n';
}

section('Web Routes (Next.js)', webFound);
section('API Modules (NestJS)', apiFound);
section('Mobile Screens (Expo)', mobileFound);

// Ensure docs directory exists
const docsDir = path.join(root, 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

fs.writeFileSync(path.join(root, 'docs/GAP_REPORT.md'), md, 'utf8');
console.log('docs/GAP_REPORT.md written');
