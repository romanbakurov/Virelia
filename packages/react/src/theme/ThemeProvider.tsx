import { useEffect, useMemo } from 'react';

import { useControllableState } from '@/hooks';

import { ThemeContext } from './ThemeContext';
import type { ThemeProviderProps } from './types';

const normalizeThemeName = (theme: ThemeProviderProps['defaultTheme']) =>
  theme === 'highContrast' ? 'high-contrast' : theme;

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

  const normalizedTheme = normalizeThemeName(currentTheme);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const { documentElement } = document;
    const previousTheme = documentElement.dataset.velliraTheme;

    documentElement.dataset.velliraTheme = normalizedTheme;

    return () => {
      if (previousTheme === undefined) {
        delete documentElement.dataset.velliraTheme;
        return;
      }

      documentElement.dataset.velliraTheme = previousTheme;
    };
  }, [normalizedTheme]);

  const value = useMemo(
    () => ({
      theme: currentTheme,
      setTheme: setCurrentTheme,
    }),
    [currentTheme, setCurrentTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <div data-vellira-theme={normalizedTheme}>{children}</div>
    </ThemeContext.Provider>
  );
};

ThemeProvider.displayName = 'ThemeProvider';
