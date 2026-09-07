import { colors } from '../../primitives/colors.js';

export const status = {
  success: {
    fg: colors.success[700],
    bg: colors.success[50],
    border: colors.success[700],
    ring: colors.success[500],
    emphasisFg: colors.success[800],
  },

  error: {
    fg: colors.error[700],
    bg: colors.error[100],
    border: colors.error[600],
    ring: colors.error[500],
    emphasisFg: colors.error[800],
  },

  warning: {
    fg: colors.warning[700],
    bg: colors.warning[50],
    border: colors.warning[700],
    ring: colors.warning[500],
    emphasisFg: colors.warning[800],
  },

  info: {
    fg: colors.info[700],
    bg: colors.info[50],
    border: colors.info[500],
    ring: colors.info[500],
    emphasisFg: colors.info[800],
  },
} as const;
