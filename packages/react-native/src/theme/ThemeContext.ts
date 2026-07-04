import { createContext } from 'react';

import { nativeThemes } from './themes';
import type { NativeThemeContextValue } from './types';

export const ThemeContext = createContext<NativeThemeContextValue>({
  themeName: 'light',
  theme: nativeThemes.light,
  setTheme: () => undefined,
});
