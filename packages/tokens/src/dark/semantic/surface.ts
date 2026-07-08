import { colors } from '../../primitives/colors.js';
import { withAlpha } from '../../utils/color.js';

export const surface = {
  default: colors.vellira[950],
  muted: colors.vellira[900],
  subtle: colors.vellira[800],
  elevated: colors.vellira[700],
  pressed: colors.vellira[600],
  danger: withAlpha(colors.error[800], 0.5),

  hover: colors.vellira[700],
  active: colors.vellira[500],

  inverse: colors.mono[50],
} as const;
