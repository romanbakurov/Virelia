import { colors } from '../../primitives/colors.js';

export const icons = {
  default: colors.mono[900],
  primary: colors.primary[300],
  secondary: colors.mono[500],
  success: colors.success[500],
  muted: colors.mono[500],
  disabled: colors.mono[400],
  subtle: colors.mono[50],
  danger: colors.error[500],

  hover: colors.primary[400],

  inverse: colors.mono[800],
  onInverse: colors.mono[950],

  brand: colors.primary[400],
} as const;
