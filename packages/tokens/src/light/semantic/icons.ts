import { colors } from '../../primitives/colors.js';

export const icons = {
  default: colors.mono[900],
  primary: colors.primary[500],
  secondary: colors.secondary[500],
  success: colors.success[600],
  muted: colors.vellira[500],
  disabled: colors.vellira[400],
  subtle: colors.mono[50],
  danger: colors.error[600],

  hover: colors.primary[400],

  inverse: colors.mono[800],
  onInverse: colors.mono[950],

  brand: colors.primary[400],
} as const;
