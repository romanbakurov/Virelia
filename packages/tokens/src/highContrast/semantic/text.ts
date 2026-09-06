import { colors } from '../../primitives/colors.js';

export const text = {
  primary: colors.mono[50],
  secondary: colors.vellira[150],
  muted: colors.gray[300],
  subtle: colors.gray[400],
  disabled: colors.gray[500],

  brand: colors.warning[400],

  interactive: colors.warning[400],
  interactiveHover: colors.warning[300],
  interactivePressed: colors.warning[200],

  inverse: colors.mono[950],
} as const;
