import { colors } from '../../primitives/colors.js';

export const border = {
  default: colors.vellira[600],
  muted: colors.vellira[800],
  strong: colors.vellira[500],
  subtle: colors.vellira[400],
  elevated: colors.vellira[200],

  focus: colors.primary[300],
} as const;
