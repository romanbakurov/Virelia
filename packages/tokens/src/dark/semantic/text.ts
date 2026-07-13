import { colors } from '../../primitives/colors.js';

export const text = {
  primary: colors.vellira[100],
  secondary: colors.vellira[300],
  muted: colors.vellira[500],
  disabled: colors.vellira[500],
  subtle: colors.mono[50],

  hover: colors.primary[400],

  inverse: colors.mono[50],
  onInverse: colors.mono[950],

  brand: colors.primary[300],
} as const;
