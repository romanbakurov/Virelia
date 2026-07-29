'use client';

import type { ReactNode } from 'react';

import { ThemeProvider } from '@vellira-ui/react';
import { useWebsiteTheme } from '@/hooks/useWebsiteTheme';
import { WebsiteThemeContextProvider } from './WebsiteThemeContext';

interface WebsiteProvidersProps {
  children: ReactNode;
}

export function WebsiteProviders({ children }: WebsiteProvidersProps) {
  const themeState = useWebsiteTheme();

  return (
    <WebsiteThemeContextProvider value={themeState}>
      <ThemeProvider theme={themeState.resolvedTheme}>{children}</ThemeProvider>
    </WebsiteThemeContextProvider>
  );
}
