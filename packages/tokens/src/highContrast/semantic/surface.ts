import { colors } from '../../primitives/colors.js';
import { withAlpha } from '../../utils/color.js';

export const surface = {
  default: colors.mono[950],
  muted: colors.gray[800],
  subtle: colors.gray[900],
  elevated: colors.gray[700],
  pressed: colors.gray[900],
  danger: withAlpha(colors.error[800], 0.5),
  disabled: colors.gray[800],

  hover: colors.gray[800],
  active: colors.gray[500],

  inverse: colors.mono[50],
} as const;
