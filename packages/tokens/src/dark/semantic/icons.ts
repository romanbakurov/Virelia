import { colors } from '../../primitives/colors.js';

export const icons = {
  default: colors.vellira[100],
  secondary: colors.mono[300],
  muted: colors.vellira[400],
  subtle: colors.vellira[500],
  disabled: colors.vellira[500],

  interactive: colors.primary[300],
  brand: colors.primary[300],
  interactiveHover: colors.primary[200],

  success: colors.success[400],
  danger: colors.error[400],

  inverse: colors.mono[950],
} as const;
