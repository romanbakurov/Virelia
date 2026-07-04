import { colors } from '../../primitives/colors.js';

export const status = {
  success: {
    fg: colors.success[700],
    bg: colors.success[50],
    border: colors.success[300],
    strong: colors.success[700],
  },

  error: {
    fg: colors.error[700],
    bg: colors.error[50],
    border: colors.error[300],
    strong: colors.error[700],
  },

  warning: {
    fg: colors.warning[700],
    bg: colors.warning[50],
    border: colors.warning[300],
    strong: colors.warning[700],
  },

  info: {
    fg: colors.info[700],
    bg: colors.info[50],
    border: colors.info[300],
    strong: colors.info[700],
  },
} as const;
