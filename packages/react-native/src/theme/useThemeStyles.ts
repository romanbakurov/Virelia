import { useMemo } from 'react';

import type { NativeTheme } from '../theme';

import { useTheme } from './useTheme';

export function useThemeStyles<TStyles>(
  createStyles: (theme: NativeTheme) => TStyles
) {
  const { theme } = useTheme();

  return useMemo(() => createStyles(theme), [createStyles, theme]);
}
