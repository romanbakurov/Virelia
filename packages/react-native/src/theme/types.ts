import type { ReactNode } from 'react';

import type { NativeTheme, NativeThemeName } from './themes';

export type ThemeProviderProps = {
  /** Controlled theme name. */
  theme?: NativeThemeName;
  /** Initial theme name for uncontrolled usage. */
  defaultTheme?: NativeThemeName;
  /** Called when the active theme changes. */
  onThemeChange?: (theme: NativeThemeName) => void;
  /** Application content rendered with theme context. */
  children: ReactNode;
};

export type NativeThemeContextValue = {
  /** Current resolved native theme name. */
  themeName: NativeThemeName;
  /** Current resolved native theme object. */
  theme: NativeTheme;
  /** Updates the current native theme. */
  setTheme: (theme: NativeThemeName) => void;
};
