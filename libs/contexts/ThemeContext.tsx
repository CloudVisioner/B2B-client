import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { shouldShowMarketingNavbar } from '../utils/shouldShowMarketingNavbar';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Only public marketing pages (same routes that show the global Navbar) may use
 * document-level dark mode (`html.dark` + globals.css). All app/dashboard routes
 * stay light so buyer/provider tools are never forced to the black theme.
 */
function allowsDocumentDarkMode(pathname: string): boolean {
  return shouldShowMarketingNavbar(pathname);
}

/** Buyer/provider login & signup — always light UI */
export function isAuthPageAlwaysLight(pathname: string): boolean {
  return pathname === '/login' || pathname === '/signup';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  /** Sync `html.dark` with route + theme; strip dark as soon as navigation leaves public pages. */
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const pathnameOnly = (url: string) => url.split('?')[0].split('#')[0];

    const applyHtmlClass = () => {
      const pathname = window.location.pathname;
      if (isAuthPageAlwaysLight(pathname)) {
        document.documentElement.classList.remove('dark');
        return;
      }
      if (!allowsDocumentDarkMode(pathname)) {
        document.documentElement.classList.remove('dark');
        return;
      }
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    };

    const onRouteStart = (url: string) => {
      const path = pathnameOnly(url);
      if (isAuthPageAlwaysLight(path) || !allowsDocumentDarkMode(path)) {
        document.documentElement.classList.remove('dark');
      }
    };

    applyHtmlClass();

    router.events.on('routeChangeStart', onRouteStart);
    router.events.on('routeChangeComplete', applyHtmlClass);
    return () => {
      router.events.off('routeChangeStart', onRouteStart);
      router.events.off('routeChangeComplete', applyHtmlClass);
    };
  }, [mounted, theme, router.asPath, router.events]);

  const toggleTheme = () => {
    if (typeof window === 'undefined') return;
    const pathname = window.location.pathname;
    if (isAuthPageAlwaysLight(pathname) || !allowsDocumentDarkMode(pathname)) {
      return;
    }
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
