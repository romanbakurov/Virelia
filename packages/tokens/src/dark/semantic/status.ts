import { colors } from '../../primitives/colors.js';

export const status = {
  success: {
    fg: colors.success[400],
    bg: 'rgba(52, 211, 153, 0.14)',
    border: colors.success[400],
    ring: colors.success[300],
    strong: colors.success[600],
  },

  error: {
    fg: colors.error[400],
    bg: 'rgba(251, 113, 133, 0.16)',
    border: colors.error[400],
    ring: colors.error[400],
    strong: colors.error[600],
  },

  warning: {
    fg: colors.warning[400],
    bg: 'rgba(251, 191, 36, 0.14)',
    border: colors.warning[400],
    strong: colors.warning[600],
  },

  info: {
    fg: colors.info[200],
    bg: 'rgba(56, 189, 248, 0.14)',
    border: colors.info[200],
    strong: colors.info[500],
  },
} as const;
