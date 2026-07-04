import { colors } from '../../primitives/colors.js';

export const border = {
  default: colors.vellira[200],
  muted: colors.vellira[150],
  subtle: colors.vellira[250],
  elevated: colors.vellira[400],
  strong: colors.vellira[600],

  focus: colors.primary[700],
} as const;
