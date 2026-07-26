'use client';

import { createContext, useContext } from 'react';

import type {
  ResolvedWebsiteTheme,
  WebsiteThemePreference,
} from '@/hooks/useWebsiteTheme';

interface WebsiteThemeContextValue {
  preference: WebsiteThemePreference;
  resolvedTheme: ResolvedWebsiteTheme;
  setPreference: (theme: WebsiteThemePreference) => void;
}

const WebsiteThemeContext = createContext<WebsiteThemeContextValue | null>(
  null
);

export const WebsiteThemeContextProvider = WebsiteThemeContext.Provider;

export function useWebsiteThemeContext() {
  const context = useContext(WebsiteThemeContext);

  if (!context) {
    throw new Error(
      'useWebsiteThemeContext must be used within WebsiteProviders.'
    );
  }

  return context;
}
