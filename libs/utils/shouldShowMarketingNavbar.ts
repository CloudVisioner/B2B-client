/** App routes under /provider that are dashboards/tools — not public provider profiles. */
const PROVIDER_APP_SEGMENTS = new Set([
  'dashboard',
  'billing',
  'settings',
  'jobs',
  'my-quotes',
  'organizations',
  'projects',
  'help-support',
  'team',
]);

/**
 * Public marketing pages that use the global SMEConnect Navbar.
 * Excludes auth, admin, and in-app dashboards.
 */
export function shouldShowMarketingNavbar(pathname: string): boolean {
  if (!pathname) return false;
  if (pathname === '/') return true;
  if (pathname === '/marketplace' || pathname.startsWith('/marketplace/')) return true;
  if (pathname === '/customer-support') return true;
  if (pathname === '/results' || pathname.startsWith('/results/')) return true;
  if (pathname === '/articles' || pathname.startsWith('/articles/')) return true;

  const m = pathname.match(/^\/provider\/([^/]+)\/?$/);
  if (m) {
    const segment = m[1];
    if (!PROVIDER_APP_SEGMENTS.has(segment)) return true;
  }

  return false;
}
