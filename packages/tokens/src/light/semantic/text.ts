import { colors } from '../../primitives/colors.js';

export const text = {
  primary: colors.vellira[700],
  secondary: colors.vellira[500],
  muted: colors.vellira[400],
  subtle: colors.vellira[400],
  disabled: colors.vellira[400],

  brand: colors.primary[700],

  interactive: colors.primary[700],
  interactiveHover: colors.primary[800],
  interactivePressed: colors.primary[900],

  inverse: colors.mono[50],
} as const;
