import { colors } from '../../primitives/colors.js';

export const icons = {
  default: colors.mono[50],
  secondary: colors.gray[200],
  muted: colors.gray[400],
  subtle: colors.gray[300],
  disabled: colors.gray[500],

  primary: colors.warning[300],
  brand: colors.warning[300],
  hover: colors.warning[200],

  success: colors.success[300],
  danger: colors.error[300],

  inverse: colors.mono[950],
} as const;
