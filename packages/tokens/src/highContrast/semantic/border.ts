import { colors } from '../../primitives/colors.js';

export const border = {
  default: colors.mono[50],
  muted: colors.gray[600],
  subtle: colors.gray[700],
  elevated: colors.gray[300],
  strong: colors.mono[100],
  disabled: colors.gray[700],

  focus: colors.warning[500],
} as const;
