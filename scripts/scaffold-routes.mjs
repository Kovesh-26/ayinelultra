import { mkdirSync, writeFileSync, existsSync } from 'fs'
import { dirname } from 'path'

const T = (title, subtitle = '') => `import PageHeader from '@/components/PageHeader'

export default function Page() {
  return (
    <section>
      <PageHeader title="${title}" subtitle="${subtitle}" />
      <div className="card p-6">
        <p className="text-sm text-muted-foreground">
          Placeholder page for <strong>${title}</strong>. Replace with real implementation.
        </p>
        <ul className="mt-4 list-disc pl-5 text-sm text-muted-foreground">
          <li>Brand wording: Channel → Studio, Subscribe → Join, Follow → Tune-In, Like → Boost, Comment → Chat, Playlist → Collection, Shorts → Flips, Live → Broadcast, Subscribers → Crew, Recommendations → For You Stream.</li>
          <li>Hook up data later via API & Prisma.</li>
        </ul>
      </div>
    </section>
  )
}
`

// Flat list of route paths to scaffold (App Router: app/<route>/page.tsx)
const routes = [
  // 1) Public / Marketing
  '/', '/explore', '/trending', '/live', '/music', '/videos', '/search', '/about', '/contact', '/for-you',

  // 2) Auth & Onboarding
  '/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/onboarding',

  // 3) Viewer Content (dynamic where needed)
  '/watch/[id]', '/flip/[id]', '/music/[id]', '/collection/[id]',
  '/studio/[handle]', '/studio/[handle]/about', '/studio/[handle]/videos',
  '/studio/[handle]/music', '/studio/[handle]/live', '/studio/[handle]/community',

  // 4) User Area
  '/dashboard', '/profile', '/profile/edit', '/notifications',
  '/messages', '/messages/[threadId]', '/subscriptions', '/collections', '/history',

  // 5) Create / Upload
  '/create', '/upload/video', '/upload/music', '/go-live', '/drafts',

  // 6) Creator Studio (owner area)
  '/studio/me', '/studio/me/content', '/studio/me/content/videos', '/studio/me/content/music',
  '/studio/me/live', '/studio/me/analytics', '/studio/me/monetization', '/studio/me/memberships',
  '/studio/me/store', '/studio/me/payouts', '/studio/me/community', '/studio/me/comments',
  '/studio/me/collections', '/studio/me/settings', '/studio/me/settings/branding',
  '/studio/me/settings/links', '/studio/me/settings/permissions', '/studio/me/settings/advanced',

  // 7) Community & Social
  '/community', '/community/[topic]', '/rooms', '/rooms/[id]', '/reports/new', '/appeals/new',

  // 8) Help & Docs
  '/help', '/help/get-started', '/help/creators', '/help/viewers',
  '/help/policy', '/help/contact-support', '/status',

  // 9) Legal
  '/terms', '/privacy', '/cookies', '/community-guidelines', '/copyright', '/brand',

  // 10) Admin
  '/admin', '/admin/users', '/admin/content', '/admin/moderation', '/admin/payments'
]

// Human titles for some known paths
const titles = new Map(Object.entries({
  '/': 'Home',
  '/explore': 'Explore',
  '/trending': 'Trending',
  '/live': 'Broadcast',
  '/music': 'Music',
  '/videos': 'Videos',
  '/search': 'Search',
  '/about': 'About Ayinel',
  '/contact': 'Contact',
  '/for-you': 'For You Stream',
  '/login': 'Login',
  '/register': 'Register',
  '/forgot-password': 'Forgot Password',
  '/reset-password': 'Reset Password',
  '/verify-email': 'Verify Email',
  '/onboarding': 'Onboarding',
  '/watch/[id]': 'Watch',
  '/flip/[id]': 'Flip',
  '/music/[id]': 'Track',
  '/collection/[id]': 'Collection',
  '/studio/[handle]': 'Studio',
  '/studio/[handle]/about': 'Studio • About',
  '/studio/[handle]/videos': 'Studio • Videos',
  '/studio/[handle]/music': 'Studio • Music',
  '/studio/[handle]/live': 'Studio • Broadcasts',
  '/studio/[handle]/community': 'Studio • Community',
  '/dashboard': 'Dashboard',
  '/profile': 'Profile',
  '/profile/edit': 'Edit Profile',
  '/notifications': 'Notifications',
  '/messages': 'Messages',
  '/messages/[threadId]': 'Messages • Thread',
  '/subscriptions': 'Your Crews',
  '/collections': 'Your Collections',
  '/history': 'History',
  '/create': 'Create',
  '/upload/video': 'Upload Video',
  '/upload/music': 'Upload Music',
  '/go-live': 'Go Live',
  '/drafts': 'Drafts',
  '/studio/me': 'Creator Studio',
  '/studio/me/content': 'Studio • Content',
  '/studio/me/content/videos': 'Studio • Videos',
  '/studio/me/content/music': 'Studio • Music',
  '/studio/me/live': 'Studio • Broadcast',
  '/studio/me/analytics': 'Studio • Analytics',
  '/studio/me/monetization': 'Studio • Monetization',
  '/studio/me/memberships': 'Studio • Crew (Memberships)',
  '/studio/me/store': 'Studio • Store',
  '/studio/me/payouts': 'Studio • Payouts',
  '/studio/me/community': 'Studio • Community',
  '/studio/me/comments': 'Studio • Comments',
  '/studio/me/collections': 'Studio • Collections',
  '/studio/me/settings': 'Studio • Settings',
  '/studio/me/settings/branding': 'Studio • Branding',
  '/studio/me/settings/links': 'Studio • Links',
  '/studio/me/settings/permissions': 'Studio • Permissions',
  '/studio/me/settings/advanced': 'Studio • Advanced',
  '/community': 'Community',
  '/community/[topic]': 'Community • Topic',
  '/rooms': 'Rooms',
  '/rooms/[id]': 'Room',
  '/reports/new': 'Report Content',
  '/appeals/new': 'Submit Appeal',
  '/help': 'Help Center',
  '/help/get-started': 'Help • Get Started',
  '/help/creators': 'Help • Creators',
  '/help/viewers': 'Help • Viewers',
  '/help/policy': 'Help • Policy',
  '/help/contact-support': 'Help • Contact Support',
  '/status': 'System Status',
  '/terms': 'Terms of Service',
  '/privacy': 'Privacy Policy',
  '/cookies': 'Cookie Policy',
  '/community-guidelines': 'Community Guidelines',
  '/copyright': 'Copyright / DMCA',
  '/brand': 'Brand Assets & Use',
  '/admin': 'Admin',
  '/admin/users': 'Admin • Users',
  '/admin/content': 'Admin • Content',
  '/admin/moderation': 'Admin • Moderation',
  '/admin/payments': 'Admin • Payments'
}))

function toDir(route) {
  return `apps/web/src/app${route === '/' ? '' : route}`
}

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true })
}

function writePage(route) {
  const dir = toDir(route)
  ensureDir(dir)
  const file = `${dir}/page.tsx`
  if (existsSync(file)) return
  const title = titles.get(route) || route.replace(/\[(.*?)\]/g, ':$1').split('/').filter(Boolean).map(s => s[0].toUpperCase()+s.slice(1)).join(' • ')
  writeFileSync(file, T(title), 'utf8')
  console.log('✔ Created', file)
}

routes.forEach(writePage)
console.log(`\nScaffolded ${routes.length} routes.`)
