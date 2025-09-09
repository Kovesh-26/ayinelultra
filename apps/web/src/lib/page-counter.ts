export interface PageInfo {
  path: string;
  isPage: boolean;
  hasLayout?: boolean;
  hasLoading?: boolean;
  hasError?: boolean;
  hasNotFound?: boolean;
}

export interface PageStats {
  totalPages: number;
  totalDirectories: number;
  pages: PageInfo[];
  specialFiles: {
    layouts: number;
    loadings: number;
    errors: number;
    notFounds: number;
  };
}

/**
 * Static list of all known routes in the AYINEL platform
 * This is a client-safe approach that doesn't require filesystem access
 */
const KNOWN_ROUTES: PageInfo[] = [
  { path: '', isPage: true, hasLayout: true }, // Root page
  { path: 'about', isPage: true },
  { path: 'admin', isPage: true },
  { path: 'admin/content', isPage: true },
  { path: 'admin/moderation', isPage: true },
  { path: 'admin/payments', isPage: true },
  { path: 'admin/users', isPage: true },
  { path: 'appeals', isPage: true },
  { path: 'brand', isPage: true },
  { path: 'broadcasts', isPage: true },
  { path: 'categories', isPage: true },
  { path: 'collection', isPage: true },
  { path: 'collections', isPage: true },
  { path: 'community', isPage: true },
  { path: 'community-guidelines', isPage: true },
  { path: 'contact', isPage: true },
  { path: 'cookies', isPage: true },
  { path: 'copyright', isPage: true },
  { path: 'create', isPage: true },
  { path: 'creator-studio', isPage: true },
  { path: 'dashboard', isPage: true },
  { path: 'demo', isPage: true },
  { path: 'drafts', isPage: true },
  { path: 'explore', isPage: true },
  { path: 'flip', isPage: true },
  { path: 'flips', isPage: true },
  { path: 'for-you', isPage: true },
  { path: 'forgot-password', isPage: true },
  { path: 'go-live', isPage: true },
  { path: 'help', isPage: true },
  { path: 'history', isPage: true },
  { path: 'kidzone', isPage: true },
  { path: 'library', isPage: true },
  { path: 'live', isPage: true },
  { path: 'login', isPage: true },
  { path: 'marketplace', isPage: true },
  { path: 'memberships', isPage: true },
  { path: 'messages', isPage: true },
  { path: 'monetization', isPage: true },
  { path: 'music', isPage: true },
  { path: 'notifications', isPage: true },
  { path: 'onboarding', isPage: true },
  { path: 'payouts', isPage: true },
  { path: 'plus', isPage: true },
  { path: 'privacy', isPage: true },
  { path: 'profile', isPage: true },
  { path: 'register', isPage: true },
  { path: 'reports', isPage: true },
  { path: 'reset-password', isPage: true },
  { path: 'rooms', isPage: true },
  { path: 'search', isPage: true },
  { path: 'status', isPage: true },
  { path: 'store', isPage: true },
  { path: 'studio', isPage: true },
  { path: 'studios', isPage: true },
  { path: 'subscriptions', isPage: true },
  { path: 'tags', isPage: true },
  { path: 'terms', isPage: true },
  { path: 'trending', isPage: true },
  { path: 'upload', isPage: true },
  { path: 'verify-email', isPage: true },
  { path: 'videos', isPage: true },
  { path: 'watch', isPage: true }
];

/**
 * Get comprehensive page statistics for the AYINEL platform
 */
export function countPages(): PageStats {
  const pages = KNOWN_ROUTES;
  const totalPages = pages.length;
  const totalDirectories = pages.filter(page => page.path.includes('/')).length + pages.length;
  
  // Estimate special files based on typical Next.js app structure
  const specialFiles = {
    layouts: 3, // Root layout + a few section layouts
    loadings: 1, // Root loading
    errors: 1,   // Root error
    notFounds: 1 // Root not-found
  };

  return {
    totalPages,
    totalDirectories,
    pages,
    specialFiles,
  };
}

/**
 * Get a simplified page count for quick display
 */
export function getPageCount(): number {
  return KNOWN_ROUTES.length;
}

/**
 * Get formatted route list for display
 */
export function getRouteList(): string[] {
  return KNOWN_ROUTES.map(route => route.path === '' ? '/' : `/${route.path}`);
}

/**
 * Search routes by path
 */
export function searchRoutes(query: string): PageInfo[] {
  const lowerQuery = query.toLowerCase();
  return KNOWN_ROUTES.filter(route => 
    route.path.toLowerCase().includes(lowerQuery)
  );
}