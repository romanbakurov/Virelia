import type { ReactNode } from 'react';

import type { NativeTheme, NativeThemeName } from './themes';

export type ThemeProviderProps = {
  theme?: NativeThemeName;
  defaultTheme?: NativeThemeName;
  onThemeChange?: (theme: NativeThemeName) => void;
  children: ReactNode;
};

export type NativeThemeContextValue = {
  themeName: NativeThemeName;
  theme: NativeTheme;
  setTheme: (theme: NativeThemeName) => void;
};
