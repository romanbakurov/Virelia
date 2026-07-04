import { colors } from '../../primitives/colors.js';

export const status = {
  success: {
    fg: colors.success[400],
    bg: 'rgba(74, 222, 128, 0.14)',
    border: colors.success[300],
    strong: colors.success[600],
  },

  error: {
    fg: colors.error[400],
    bg: 'rgba(251, 113, 133, 0.16)',
    border: colors.error[300],
    strong: colors.error[600],
  },

  warning: {
    fg: colors.warning[400],
    bg: 'rgba(251, 191, 36, 0.14)',
    border: colors.warning[300],
    strong: colors.warning[600],
  },

  info: {
    fg: colors.info[400],
    bg: 'rgba(96, 165, 250, 0.14)',
    border: colors.info[300],
    strong: colors.info[600],
  },
} as const;
