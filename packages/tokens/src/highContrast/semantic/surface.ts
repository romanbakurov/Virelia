import { colors } from '../../primitives/colors.js';

export const surface = {
  default: colors.mono[950],
  muted: colors.gray[900],
  subtle: colors.gray[800],
  elevated: colors.gray[700],

  hover: colors.gray[800],
  active: colors.gray[900],

  inverse: colors.mono[50],
} as const;
