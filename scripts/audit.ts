import { promises as fs } from 'fs';
import path from 'path';
import glob from 'fast-glob';

const root = process.cwd();
const webRoot = path.join(root, 'apps/web/app');
const apiRoot = path.join(root, 'apps/api/src');
const mobileRoot = path.join(root, 'apps/mobile/app');

const webExpected = [
  '/', 'watch/[id]', 'search', 'u/[handle]', 'studio/[handle]', 'studio/[handle]/collections/[id]', 'upload', 'kidzone',
  'pricing', 'legal/terms', 'legal/privacy', 'legal/dmca', 'support', 'auth/login', 'auth/verify', 'auth/callback/[provider]',
  'settings/profile', 'settings/kidzone', 'dashboard', 'dashboard/uploads', 'dashboard/uploads/new', 'dashboard/customize',
  'dashboard/memberships', 'dashboard/newsletters', 'dashboard/analytics', 'dashboard/studio', 'dashboard/collections',
  'dashboard/collections/[id]/edit', 'admin', 'admin/moderation', '404', '500',
  // Full-platform additions (abbrev — we'll scaffold them later)
  'trending','flips','music','broadcasts','categories','tags/[tag]','studios','studios/family-friendly','collections/[id]','history','library',
  'watch/[id]/clips','watch/[id]/captions','watch/[id]/chapters','watch/[id]/editor','series/[slug]','series/[slug]/[episode]',
  'friends','friends/requests','groups','groups/[id]','inbox','inbox/[threadId]','chat/[roomId]','settings/account','settings/security','settings/payments','settings/notifications','settings/privacy','settings/studio/branding','settings/studio/integrations','settings/store','settings/address','settings/tax','plus','store','store/cart','store/orders','store/orders/[id]','payouts','payouts/tax','memberships','memberships/manage','kidzone/studios','kidzone/approvals','kidzone/time','parent','parent/approvals','parent/pin','guidelines','help','help/articles','help/articles/[slug]','appeals','admin/queues','admin/reports','admin/appeals','admin/users','admin/studios','admin/media','admin/payments','admin/feature-flags','admin/kidzone','admin/newsletters','admin/search'
];

const apiExpected = ['auth','users','studios','media','collections','chat','kidsettings','payments','webhooks','newsletters','moderation','admin','search','store','payouts','tax','feature-flags','reports','appeals'];

const mobileExpected = [
  'onboarding','login','verify','home','search','watch','chat','u/[handle]','studio/[handle]','collection/[id]','upload','kidzone','settings/profile','settings/kidzone','plus','tips','inbox','dm/[id]',
  // extras
  'trending','flips','music','broadcasts','categories','tags/[tag]','studios','player/clips','player/captions','player/chapters','friends','friends/requests','groups','groups/[id]','chat/[roomId]','inbox/[threadId]','store','store/cart','orders','orders/[id]','payouts','settings/security','settings/payments','settings/notifications','settings/privacy','settings/studio/branding','settings/studio/integrations','parent','parent/approvals','parent/pin','admin/reports','admin/moderation','admin/appeals'
];

function hasPage(route: string, files: string[]): boolean {
  const page = route === '/' ? 'page.tsx' : path.join(route, 'page.tsx');
  return files.some(f => f.replace(/\\/g,'/').endsWith(page));
}

(async () => {
  const webFiles = await glob(['**/app/**/page.tsx'], { cwd: path.join(root,'apps/web'), dot: true });
  const apiFiles = await glob(['src/modules/**/**.{ts,tsx}'], { cwd: path.join(root,'apps/api') });
  const mobileFiles = await glob(['app/**/index.tsx'], { cwd: path.join(root,'apps/mobile') });

  const webFound = webExpected.map(r => ({ route: r, ok: hasPage(r, webFiles) }));
  const apiFound = apiExpected.map(m => ({ module: m, ok: apiFiles.some(f => f.includes(`/modules/${m}/`)) }));
  const mobileFound = mobileExpected.map(s => ({ screen: s, ok: mobileFiles.some(f => f.includes(`app/${s}/`)) }));

  let md = '# GAP_REPORT — Ayinel\n\n';
  const section = (title: string, rows: {label: string, ok: boolean}[]) => {
    const found = rows.filter(r => r.ok).length; const total = rows.length;
    md += `## ${title} (Found ${found}/${total})\n\n| Item | Status |\n|---|---|\n`;
    for (const r of rows) md += `| ${r.label || (r as any).route || (r as any).module || (r as any).screen} | ${r.ok ? '✅' : '❌'} |\n`;
    md += '\n';
  };

  section('Web Routes (Next.js)', webFound.map(r => ({ label: r.route, ok: r.ok })));
  section('API Modules (NestJS)', apiFound.map(m => ({ label: m.module, ok: m.ok })));
  section('Mobile Screens (Expo)', mobileFound.map(s => ({ label: s.screen, ok: s.ok })));

  await fs.mkdir(path.join(root,'docs'), { recursive: true });
  await fs.writeFile(path.join(root,'docs/GAP_REPORT.md'), md, 'utf8');
  console.log('docs/GAP_REPORT.md written');
})();
