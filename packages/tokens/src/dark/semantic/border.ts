import { colors } from '../../primitives/colors.js';

export const border = {
  default: colors.vellira[400],
  muted: colors.vellira[700],
  strong: colors.vellira[800],
  subtle: colors.vellira[900],
  elevated: colors.vellira[500],
  disabled: colors.vellira[600],

  focus: colors.primary[300],
} as const;
