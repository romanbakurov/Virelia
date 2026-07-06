import { colors } from '../../primitives/colors.js';

export const surface = {
  default: colors.vellira[100],
  muted: colors.vellira[50],
  subtle: colors.mono[50],
  elevated: colors.secondary[100],
  pressed: colors.vellira[200],
  disabled: colors.vellira[100],

  hover: colors.vellira[150],
  active: colors.vellira[300],

  inverse: colors.vellira[950],
} as const;
