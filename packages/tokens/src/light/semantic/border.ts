import { colors } from '../../primitives/colors.js';

export const border = {
  subtle: colors.vellira[150],
  muted: colors.vellira[200],
  default: colors.vellira[300],
  strong: colors.vellira[500],

  elevated: colors.vellira[250],
  disabled: colors.vellira[200],

  interactive: colors.primary[700],
} as const;
