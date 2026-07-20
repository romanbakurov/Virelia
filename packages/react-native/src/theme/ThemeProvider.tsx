import { useMemo } from 'react';

import { useControllableState } from '../hooks';

import { ThemeContext } from './ThemeContext';
import { nativeThemes } from './themes';
import type { ThemeProviderProps } from './types';

export const ThemeProvider = ({
  theme,
  defaultTheme = 'light',
  onThemeChange,
  children,
}: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useControllableState({
    value: theme,
    defaultValue: defaultTheme,
    onChange: onThemeChange,
  });

  const value = useMemo(
    () => ({
      themeName: currentTheme,
      theme: nativeThemes[currentTheme],
      setTheme: setCurrentTheme,
    }),
    [currentTheme, setCurrentTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

ThemeProvider.displayName = 'ThemeProvider';
