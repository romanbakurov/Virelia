import { colors } from '../../primitives/colors.js';

export const surface = {
  default: colors.vellira[950],
  muted: colors.vellira[900],
  subtle: colors.vellira[800],
  elevated: colors.vellira[700],

  hover: colors.vellira[800],
  active: colors.vellira[500],

  inverse: colors.mono[50],
} as const;
