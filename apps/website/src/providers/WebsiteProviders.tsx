'use client';

import type { ReactNode } from 'react';

import { ThemeProvider as WebThemeProvider } from '@vellira-ui/react';
import {
  ThemeProvider as NativeThemeProvider,
  type NativeThemeName,
} from '@vellira-ui/react-native';

import { useWebsiteTheme } from '@/hooks/useWebsiteTheme';
import { WebsiteThemeContextProvider } from './WebsiteThemeContext';

interface WebsiteProvidersProps {
  children: ReactNode;
}

export function WebsiteProviders({ children }: WebsiteProvidersProps) {
  const themeState = useWebsiteTheme();

  const nativeTheme: NativeThemeName =
    themeState.resolvedTheme === 'high-contrast'
      ? 'highContrast'
      : themeState.resolvedTheme;

  return (
    <WebsiteThemeContextProvider value={themeState}>
      <WebThemeProvider theme={themeState.resolvedTheme}>
        <NativeThemeProvider theme={nativeTheme}>
          {children}
        </NativeThemeProvider>
      </WebThemeProvider>
    </WebsiteThemeContextProvider>
  );
}
