import { colors } from '../../primitives/colors.js';

export const icons = {
  primary: colors.primary[500],
  secondary: colors.secondary[500],
  muted: colors.vellira[500],
  disabled: colors.vellira[400],
  subtle: colors.mono[50],

  hover: colors.primary[400],

  inverse: colors.mono[800],
  onInverse: colors.mono[950],

  brand: colors.primary[400],
} as const;
