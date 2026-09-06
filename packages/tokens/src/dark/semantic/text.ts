import { colors } from '../../primitives/colors.js';

export const text = {
  primary: colors.vellira[100],
  secondary: colors.vellira[300],
  muted: colors.vellira[400],
  subtle: colors.mono[500],
  disabled: colors.vellira[500],

  brand: colors.primary[300],

  interactive: colors.primary[300],
  interactiveHover: colors.primary[400],
  interactivePressed: colors.primary[500],

  inverse: colors.mono[950],
} as const;
