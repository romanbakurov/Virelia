import type { NativeTheme } from '../theme';

type ThemeSemanticColor = {
  light: string;
  dark: string;
  highContrast: string;
};

export function semanticColor(theme: NativeTheme, colors: ThemeSemanticColor) {
  if (theme.name === 'dark') return colors.dark;
  if (theme.name === 'high-contrast') return colors.highContrast;

  return colors.light;
}
