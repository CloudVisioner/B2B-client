import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      // Check if current page is a dashboard (admin, provider, or buyer)
      const pathname = window.location.pathname;
      const isDashboardPage = (
        pathname.startsWith('/admin') ||
        pathname.startsWith('/provider') ||
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/settings') ||
        pathname.startsWith('/orders') ||
        pathname.startsWith('/service-requests') ||
        pathname.startsWith('/organizations') ||
        pathname.startsWith('/notifications')
      );

      // Force light mode for dashboard pages
      if (isDashboardPage) {
        document.documentElement.classList.remove('dark');
        return;
      }

      // Apply theme for public pages
      localStorage.setItem('theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme, mounted]);

  // Listen for route changes
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const handleRouteChange = () => {
      const pathname = window.location.pathname;
      const isDashboardPage = (
        pathname.startsWith('/admin') ||
        pathname.startsWith('/provider') ||
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/settings') ||
        pathname.startsWith('/orders') ||
        pathname.startsWith('/service-requests') ||
        pathname.startsWith('/organizations') ||
        pathname.startsWith('/notifications')
      );

      if (isDashboardPage) {
        document.documentElement.classList.remove('dark');
      } else {
        // Apply saved theme for public pages
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    // Check on mount
    handleRouteChange();

    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [mounted]);

  const toggleTheme = () => {
    if (typeof window === 'undefined') return;
    
    const pathname = window.location.pathname;
    const isDashboardPage = (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/provider') ||
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/settings') ||
      pathname.startsWith('/orders') ||
      pathname.startsWith('/service-requests') ||
      pathname.startsWith('/organizations') ||
      pathname.startsWith('/notifications')
    );

    // Don't allow theme toggle on dashboard pages
    if (isDashboardPage) {
      return;
    }
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
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
