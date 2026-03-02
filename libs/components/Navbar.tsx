import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn } from '../auth';
import { useTheme } from '../contexts/ThemeContext';
import { PageId } from '../types/index';

interface NavbarProps {
  currentPage?: PageId;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  // ========== HOOKS & STATE ==========
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ========== LIFECYCLES ==========
  useEffect(() => {
    setMounted(true);
    setLoggedIn(isLoggedIn());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ========== UTILITIES ==========
  const getCurrentPage = (): PageId => {
    if (currentPage) return currentPage;
    if (router.pathname === '/') return 'home';
    if (router.pathname === '/marketplace') return 'marketplace';
    if (router.pathname === '/results' || router.pathname.startsWith('/results/')) return 'results';
    if (router.pathname.startsWith('/provider/')) return 'provider-profile';
    return 'home';
  };

  const activePage = getCurrentPage();

  const getDashboardPath = (): string => {
    if (loggedIn && currentUser?.userRole) {
      const role = currentUser.userRole;
      if (role === 'PROVIDER' || role === 'provider') {
        return '/provider/dashboard';
      }
    }
    return '/dashboard';
  };

  const navLinks = [
    { href: '/', label: 'Home', page: 'home' as PageId },
    { href: '/marketplace', label: 'Marketplace', page: 'marketplace' as PageId },
    { href: '/results', label: 'Results', page: 'results' as PageId },
  ];

  // ========== CONDITIONAL RENDERING ==========
  if (!mounted) {
    return (
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-white/10 dark:border-slate-700/10`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-full">
          <div className="flex items-center justify-between h-full">
            <Link href="/" className="text-2xl font-extrabold tracking-tight">
              <span className="text-indigo-600 dark:text-indigo-400">SME</span>
              <span className="text-slate-900 dark:text-white">Connect</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // ========== RENDER ==========
  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isScrolled
            ? 'h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/30 shadow-lg shadow-black/5'
            : 'h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-white/10 dark:border-slate-700/10'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo (Left) */}
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Link href="/" className="text-2xl font-extrabold tracking-tight">
                <span className="text-indigo-600 dark:text-indigo-400">SME</span>
                <span className="text-slate-900 dark:text-white">Connect</span>
              </Link>
            </motion.div>

            {/* Center Nav Links (Desktop) */}
            <div className="hidden md:flex items-center justify-center gap-8 lg:gap-12 absolute left-1/2 transform -translate-x-1/2">
              {navLinks.map((link) => {
                const isActive = activePage === link.page;
                return (
                  <motion.div key={link.href} whileHover={{ y: -1 }} transition={{ duration: 0.2 }}>
                    <Link
                      href={link.href}
                      className={`relative text-base font-semibold transition-colors px-2 py-1 ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                          layoutId="activeIndicator"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      {!isActive && (
                        <motion.div
                          className="absolute bottom-0 left-1/2 right-1/2 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1, left: 0, right: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center relative overflow-hidden group"
                aria-label="Toggle dark mode"
                suppressHydrationWarning
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {mounted && theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-500 relative z-10" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-500 relative z-10" />
                )}
              </motion.button>

              {/* Auth Buttons / Dashboard */}
              {mounted && loggedIn ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={getDashboardPath()}
                    className="relative inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-base font-bold rounded-lg shadow-lg shadow-indigo-500/30 overflow-hidden group"
                  >
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="pointer-events-none absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative z-10 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg" aria-hidden="true">dashboard</span>
                      <span>Dashboard</span>
                    </span>
                  </Link>
                </motion.div>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="hidden sm:block text-base font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Sign up
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/login"
                      className="relative inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-base font-bold rounded-lg shadow-lg shadow-indigo-500/30 overflow-hidden group"
                    >
                      <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="pointer-events-none absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <span className="relative z-10">Login</span>
                    </Link>
                  </motion.div>
                </>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle menu"
                whileTap={{ scale: 0.95 }}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[99] md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-l border-white/20 dark:border-slate-700/30 shadow-2xl z-[100] md:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="text-xl font-extrabold tracking-tight">
                    <span className="text-indigo-600 dark:text-indigo-400">SME</span>
                    <span className="text-slate-900 dark:text-white">Connect</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                  </button>
                </div>

                {/* Mobile Nav Links */}
                <nav className="space-y-2">
                  {navLinks.map((link) => {
                    const isActive = activePage === link.page;
                    return (
                      <motion.div
                        key={link.href}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                            isActive
                              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Mobile Auth Section */}
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 space-y-4">
                  {mounted && loggedIn ? (
                    <Link
                      href={getDashboardPath()}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-base font-bold rounded-lg text-center shadow-lg"
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full px-6 py-3 text-center text-base font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        Sign up
                      </Link>
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-base font-bold rounded-lg text-center shadow-lg"
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
