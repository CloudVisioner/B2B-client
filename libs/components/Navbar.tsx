import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Sun, Moon } from 'lucide-react';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn } from '../auth';
import { useTheme } from '../contexts/ThemeContext';
import { PageId } from '../types/index';

interface NavbarProps {
  currentPage?: PageId;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);

  // Prevent hydration mismatch by only checking login status after mount
  React.useEffect(() => {
    setMounted(true);
    setLoggedIn(isLoggedIn());
  }, []);
  
  // Determine current page from route
  const getCurrentPage = (): PageId => {
    if (currentPage) return currentPage;
    if (router.pathname === '/') return 'home';
    if (router.pathname === '/marketplace') return 'marketplace';
    if (router.pathname === '/results' || router.pathname.startsWith('/results/')) return 'results';
    if (router.pathname.startsWith('/provider/')) return 'provider-profile';
    return 'home';
  };

  const activePage = getCurrentPage();
  
  const getDashboardPath = () => {
    if (loggedIn && currentUser?.userRole) {
      const role = currentUser.userRole;
      if (role === 'PROVIDER' || role === 'provider') {
        return '/provider/dashboard';
      }
    }
    return '/dashboard';
  };
  
  const linkClass = (page: PageId) =>
    `text-base font-semibold transition-colors ${
      activePage === page
        ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 pb-1'
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 transition-colors">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="flex items-center h-20">
          {/* ── Logo (left, flex-1 to balance right side) ── */}
          <div className="flex-1 flex items-center">
            <Link href="/" className="text-2xl font-extrabold tracking-tight">
              <span className="text-indigo-600 dark:text-indigo-400">SME</span>
              <span className="text-slate-900 dark:text-white">Connect</span>
            </Link>
          </div>

          {/* ── Center Nav Links (true center) ── */}
          <div className="hidden md:flex items-center justify-center gap-12">
            <Link href="/" className={linkClass('home')}>
              Home
            </Link>
            <Link href="/marketplace" className={linkClass('marketplace')}>
              Marketplace
            </Link>
            <Link href="/results" className={linkClass('results')}>
              Results
            </Link>
          </div>

          {/* ── Right Actions (flex-1 to balance left side) ── */}
          <div className="flex-1 flex items-center justify-end gap-5">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
              aria-label="Toggle dark mode"
              suppressHydrationWarning
            >
              {mounted && theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-500" />
              )}
            </button>
            {mounted && loggedIn ? (
              <Link
                href={getDashboardPath()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-base font-bold px-6 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg" aria-hidden="true">dashboard</span>
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="text-base font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Sign up
                </Link>
                <Link
                  href="/login"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-base font-bold px-6 py-2.5 rounded-lg shadow-sm transition-all"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;