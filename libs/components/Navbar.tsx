import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { PageId } from '../types/index';

interface NavbarProps {
  currentPage?: PageId;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  
  // Determine current page from route
  const getCurrentPage = (): PageId => {
    if (currentPage) return currentPage;
    if (router.pathname === '/') return 'home';
    if (router.pathname === '/marketplace') return 'marketplace';
    if (router.pathname === '/providers') return 'providers';
    if (router.pathname.startsWith('/provider/')) return 'provider-profile';
    return 'home';
  };

  const activePage = getCurrentPage();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          <Link 
            href="/"
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-3xl font-bold tracking-tight">
              <span className="text-indigo-600 dark:text-indigo-400">SME</span>
              <span className="text-slate-900 dark:text-white">Connect</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            <Link 
              href="/"
              className={`text-lg font-medium transition-colors ${activePage === 'home' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
            >
              Home
            </Link>
            <Link 
              href="/marketplace"
              className={`text-lg font-medium transition-colors ${activePage === 'marketplace' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
            >
              Categories
            </Link>
            <Link 
              href="/providers"
              className={`text-lg font-medium transition-colors ${activePage === 'providers' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
            >
              Providers
            </Link>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all duration-200 flex items-center justify-center group"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-500 group-hover:rotate-12 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:-rotate-12 transition-transform" />
              )}
            </button>
            
            <Link href="/signup" className="text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Sign up
            </Link>
            <Link href="/login" className="text-lg font-medium bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 px-6 py-2.5 rounded-lg transition-all">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;