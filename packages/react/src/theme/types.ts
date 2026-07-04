import type { ReactNode } from 'react';

export type ThemeName = 'light' | 'dark' | 'high-contrast' | 'highContrast';

export interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export interface ThemeProviderProps {
  theme?: ThemeName;
  defaultTheme?: ThemeName;
  onThemeChange?: (theme: ThemeName) => void;
  children: ReactNode;
}
