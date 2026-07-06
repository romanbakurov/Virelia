import { colors } from '../../primitives/colors.js';

export const surface = {
  default: colors.mono[950],
  muted: colors.gray[800],
  subtle: colors.gray[900],
  elevated: colors.gray[700],
  pressed: colors.gray[900],

  hover: colors.gray[800],
  active: colors.gray[900],

  inverse: colors.mono[50],
} as const;
