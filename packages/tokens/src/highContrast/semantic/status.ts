import { colors } from '../../primitives/colors.js';

export const status = {
  success: {
    fg: colors.success[300],
    bg: colors.success[950],
    border: colors.success[300],
    ring: colors.success[300],
    strong: colors.success[200],
  },

  error: {
    fg: colors.error[400],
    bg: colors.error[950],
    border: colors.error[400],
    ring: colors.error[400],
    strong: colors.error[200],
  },

  warning: {
    fg: colors.warning[300],
    bg: colors.warning[950],
    border: colors.warning[300],
    ring: colors.warning[300],
    strong: colors.warning[200],
  },

  info: {
    fg: colors.info[200],
    bg: colors.info[950],
    border: colors.info[200],
    ring: colors.info[200],
    strong: colors.info[150],
  },
} as const;
