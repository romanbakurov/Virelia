import { colors } from '../../primitives/colors.js';

export const status = {
  success: {
    fg: colors.success[700],
    bg: colors.success[50],
    border: colors.success[700],
    ring: colors.success[500],
    strong: colors.success[800],
  },

  error: {
    fg: colors.error[700],
    bg: colors.error[50],
    border: colors.error[600],
    ring: colors.error[500],
    strong: colors.error[800],
  },

  warning: {
    fg: colors.warning[700],
    bg: colors.warning[50],
    border: colors.warning[700],
    ring: colors.warning[500],
    strong: colors.warning[800],
  },

  info: {
    fg: colors.info[700],
    bg: colors.info[50],
    border: colors.info[500],
    ring: colors.info[500],
    strong: colors.info[800],
  },
} as const;
