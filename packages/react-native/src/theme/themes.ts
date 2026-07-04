import {
  darkTheme,
  highContrastTheme,
  lightTheme,
  type VelliraTheme,
} from '@vellira-ui/tokens';

export const nativeThemes: Record<
  'light' | 'dark' | 'highContrast',
  VelliraTheme
> = {
  light: lightTheme,
  dark: darkTheme,
  highContrast: highContrastTheme,
};

export type NativeThemeName = keyof typeof nativeThemes;
export type NativeTheme = (typeof nativeThemes)[NativeThemeName];
