import { colors } from '../../primitives/colors.js';

export const status = {
  success: {
    fg: colors.success[300],
    bg: colors.gray[900],
    border: colors.success[300],
    strong: colors.success[300],
  },

  error: {
    fg: colors.error[400],
    bg: colors.gray[900],
    border: colors.error[500],
    strong: colors.error[300],
  },

  warning: {
    fg: colors.warning[400],
    bg: colors.gray[900],
    border: colors.warning[400],
    strong: colors.warning[400],
  },

  info: {
    fg: colors.info[400],
    bg: colors.gray[900],
    border: colors.info[400],
    strong: colors.info[400],
  },
} as const;
