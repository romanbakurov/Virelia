import { colors } from '../../primitives/colors.js';

export const border = {
  subtle: colors.vellira[800],
  muted: colors.vellira[700],
  default: colors.vellira[600],
  strong: colors.vellira[500],

  elevated: colors.vellira[600],
  disabled: colors.vellira[700],

  interactive: colors.primary[300],
} as const;
