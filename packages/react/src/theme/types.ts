import type { ReactNode } from 'react';

export type ThemeName = 'light' | 'dark' | 'high-contrast' | 'highContrast';

export interface ThemeContextValue {
  /** Current resolved theme name. */
  theme: ThemeName;
  /** Updates the current theme. */
  setTheme: (theme: ThemeName) => void;
}

export interface ThemeProviderProps {
  /** Controlled theme name. */
  theme?: ThemeName;
  /** Initial theme name for uncontrolled usage. */
  defaultTheme?: ThemeName;
  /** Called when the active theme changes. */
  onThemeChange?: (theme: ThemeName) => void;
  /** Synchronizes the active theme to document attributes. */
  syncDocument?: boolean;
  /** Application content rendered with theme context. */
  children: ReactNode;
}
