import { colors } from '../../primitives/colors.js';

export const border = {
  subtle: colors.gray[700],
  muted: colors.gray[500],
  default: colors.gray[400],
  strong: colors.warning[300],

  elevated: colors.gray[300],
  disabled: colors.gray[600],

  focus: colors.warning[300],
} as const;
