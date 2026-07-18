import { colors } from '../../primitives/colors.js';

export const icons = {
  default: colors.vellira[700],
  secondary: colors.vellira[500],
  muted: colors.vellira[400],
  subtle: colors.vellira[400],
  disabled: colors.vellira[400],

  primary: colors.primary[700],
  brand: colors.primary[700],
  hover: colors.primary[800],

  success: colors.success[500],
  danger: colors.error[700],

  inverse: colors.mono[50],
} as const;
