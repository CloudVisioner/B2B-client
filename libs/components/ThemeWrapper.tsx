import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
