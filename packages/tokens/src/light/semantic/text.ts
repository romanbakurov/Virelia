import { colors } from '../../primitives/colors.js';

export const text = {
  primary: colors.vellira[600],
  secondary: colors.vellira[500],
  muted: colors.vellira[400],
  disabled: colors.gray[400],
  subtle: colors.mono[800],

  inverse: colors.mono[50],
  onInverse: colors.mono[900],

  brand: colors.primary[700],
} as const;
