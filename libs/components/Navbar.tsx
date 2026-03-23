import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Sun, Moon, Menu, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn, normalizeRole, isAdminPortalRole } from '../auth';
import { useTheme } from '../contexts/ThemeContext';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/results', label: 'About Us' },
  { href: '/articles', label: 'Articles' },
  { href: '/customer-support', label: 'Support' },
] as const;

/** Single active nav item from current pathname (Pages Router). */
export function isNavLinkActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/';
  if (href === '/results') {
    return pathname === '/results' || pathname.startsWith('/results/');
  }
  if (href === '/articles') {
    return pathname === '/articles' || pathname.startsWith('/articles/');
  }
  if (href === '/marketplace') {
    return pathname === '/marketplace' || pathname.startsWith('/marketplace/');
  }
  if (href === '/customer-support') {
    return pathname === '/customer-support';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = router.pathname;
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLoggedIn(isLoggedIn());
  }, []);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, [currentUser?._id, currentUser?.accessToken, router.asPath]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardPath = (): string => {
    const role = normalizeRole(currentUser?.userRole);
    if (!loggedIn || !role) return '/dashboard';
    if (isAdminPortalRole(role)) return '/admin';
    if (role === 'PROVIDER') return '/provider/dashboard';
    return '/dashboard';
  };

  const shellClass =
    'fixed top-0 left-0 right-0 z-[100] transition-[height,background-color] duration-300 backdrop-blur-[12px] border-b border-black/[0.05] dark:border-white/[0.06]';

  if (!mounted) {
    return (
      <nav
        className={`${shellClass} h-[5.25rem] bg-white/80 dark:bg-slate-950/75`}
        aria-label="Main"
      >
        <div className="mx-auto flex h-full max-w-[min(1400px,calc(100%-2rem))] items-center justify-between px-6 lg:px-12">
          <Link href="/" className="text-2xl font-extrabold tracking-tight">
            <span className="text-indigo-600 dark:text-indigo-400">SME</span>
            <span className="text-slate-900 dark:text-white">Connect</span>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`${shellClass} ${
          isScrolled
            ? 'h-[4.25rem] bg-white/85 dark:bg-slate-950/88 shadow-[0_1px_0_rgba(0,0,0,0.04)] dark:shadow-[0_1px_0_rgba(255,255,255,0.04)]'
            : 'h-[5.25rem] bg-white/75 dark:bg-slate-950/70'
        }`}
        aria-label="Main"
      >
        <div className="mx-auto flex h-full max-w-[min(1400px,calc(100%-2rem))] items-center justify-between px-6 lg:px-12">
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            <Link href="/" className="text-2xl font-extrabold tracking-tight lg:text-[1.75rem]">
              <span className="text-indigo-600 dark:text-indigo-400">SME</span>
              <span className="text-slate-900 dark:text-white">Connect</span>
            </Link>
          </motion.div>

          <div className="absolute left-1/2 hidden -translate-x-1/2 transform md:flex">
            <LayoutGroup id="main-nav">
              <div className="flex items-center gap-6 lg:gap-10">
                {NAV_LINKS.map((link) => {
                  const isActive = isNavLinkActive(link.href, pathname);
                  return (
                    <motion.div key={link.href} whileHover={{ y: -1 }} transition={{ duration: 0.18 }}>
                      <Link
                        href={link.href}
                        className={`relative block rounded-xl px-1 py-2.5 text-[15px] font-medium leading-none tracking-tight transition-colors lg:py-3 lg:text-base ${
                          isActive
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                        }`}
                      >
                        <span className="relative z-10 whitespace-nowrap">{link.label}</span>
                        {isActive ? (
                          <motion.span
                            layoutId="navbar-active-underline"
                            className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-slate-900 dark:bg-white lg:bottom-0.5"
                            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                          />
                        ) : null}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </LayoutGroup>
          </div>

          <div className="flex flex-shrink-0 items-center gap-4 lg:gap-5">
            <motion.button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('smeconnect-open-chat'));
                }
              }}
              className="hidden items-center justify-center rounded-xl bg-slate-900/90 p-3 text-white shadow-sm ring-1 ring-slate-900/10 transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:ring-white/20 dark:hover:bg-slate-100 md:flex"
              aria-label="Open chat"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={2} />
            </motion.button>

            <motion.button
              type="button"
              onClick={toggleTheme}
              className="relative flex items-center justify-center overflow-hidden rounded-xl p-3 transition-colors hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
              aria-label="Toggle dark mode"
              suppressHydrationWarning
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
            >
              {theme === 'dark' ? (
                <Sun className="relative z-10 h-5 w-5 text-amber-500 lg:h-6 lg:w-6" strokeWidth={2} />
              ) : (
                <Moon className="relative z-10 h-5 w-5 text-slate-500 lg:h-6 lg:w-6" strokeWidth={2} />
              )}
            </motion.button>

            {mounted && loggedIn ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={getDashboardPath()}
                  className="relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 ring-1 ring-inset ring-white/25 transition hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 hover:shadow-indigo-500/35"
                >
                  {isAdminPortalRole(currentUser?.userRole) ? 'Admin' : 'Dashboard'}
                </Link>
              </motion.div>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="hidden text-base font-semibold tracking-tight text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white sm:block"
                >
                  Sign up
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/login"
                    className="relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 px-6 py-3 text-base font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] ring-1 ring-inset ring-white/20 transition hover:from-indigo-500 hover:via-indigo-500 hover:to-violet-500"
                  >
                    Login
                  </Link>
                </motion.div>
              </>
            )}

            <motion.button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2.5 transition-colors hover:bg-slate-100/80 dark:hover:bg-slate-800/80 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              whileTap={{ scale: 0.96 }}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-slate-700 dark:text-slate-300" />
              ) : (
                <Menu className="h-6 w-6 text-slate-700 dark:text-slate-300" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[99] bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              className="fixed bottom-0 right-0 top-0 z-[100] w-[min(20rem,100vw)] overflow-y-auto border-l border-black/[0.06] bg-white/95 backdrop-blur-[12px] dark:border-white/[0.06] dark:bg-slate-950/95 md:hidden"
            >
              <div className="p-6">
                <div className="mb-8 flex items-center justify-between">
                  <div className="text-xl font-extrabold tracking-tight">
                    <span className="text-indigo-600 dark:text-indigo-400">SME</span>
                    <span className="text-slate-900 dark:text-white">Connect</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                  </button>
                </div>

                <nav className="space-y-3" aria-label="Mobile">
                  {NAV_LINKS.map((item) => {
                    const isActive = isNavLinkActive(item.href, pathname);
                    return (
                      <motion.div key={item.href} whileHover={{ x: 4 }} transition={{ duration: 0.18 }}>
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block rounded-xl px-4 py-3.5 text-base font-semibold tracking-tight transition-colors ${
                            isActive
                              ? 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white'
                              : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900'
                          }`}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                <div className="mt-8 space-y-3 border-t border-black/[0.06] pt-8 dark:border-white/[0.06]">
                  {mounted && loggedIn ? (
                    <Link
                      href={getDashboardPath()}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-3.5 text-center text-base font-semibold text-white shadow-lg shadow-indigo-500/25 ring-1 ring-inset ring-white/25"
                    >
                      {isAdminPortalRole(currentUser?.userRole) ? 'Admin panel' : 'Go to Dashboard'}
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full rounded-xl py-3.5 text-center text-base font-semibold text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                      >
                        Sign up
                      </Link>
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 py-3.5 text-center text-base font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] ring-1 ring-inset ring-white/20"
                      >
                        Login
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
