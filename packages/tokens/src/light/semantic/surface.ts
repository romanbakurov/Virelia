import { colors } from '../../primitives/colors.js';

export const surface = {
  default: colors.vellira[25],
  muted: colors.vellira[50],
  subtle: colors.vellira[100],
  elevated: colors.mono[50],

  hover: colors.vellira[150],
  active: colors.vellira[500],

  inverse: colors.vellira[950],
} as const;
