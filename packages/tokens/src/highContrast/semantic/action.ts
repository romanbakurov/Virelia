import { colors } from '../../primitives/colors.js';

import { text } from './text.js';

export const action = {
  primary: {
    default: {
      bg: colors.primary[600],
      fg: text.primary,
      border: colors.primary[600],
    },
    hover: {
      bg: colors.primary[700],
      fg: text.primary,
      border: colors.primary[700],
    },
    active: {
      bg: colors.primary[600],
      fg: text.primary,
      border: colors.primary[600],
    },
    muted: {
      bg: colors.primary[600],
      fg: colors.mono[50],
      border: colors.primary[600],
    },
    subtle: {
      bg: colors.gray[900],
      fg: text.inverse,
      border: colors.primary[500],
    },
  },

  secondary: {
    default: {
      bg: colors.info[700],
      fg: text.primary,
      border: colors.info[700],
    },
    hover: {
      bg: colors.info[800],
      fg: text.primary,
      border: colors.info[800],
    },
    active: {
      bg: colors.info[700],
      fg: text.primary,
      border: colors.info[700],
    },
  },

  close: {
    default: {
      bg: colors.mono[50],
      fg: text.inverse,
      border: colors.mono[50],
    },
    hover: {
      bg: colors.gray[300],
      fg: text.inverse,
      border: colors.gray[300],
    },
    active: {
      bg: colors.gray[400],
      fg: text.inverse,
      border: colors.gray[400],
    },
  },

  danger: {
    default: {
      bg: colors.error[600],
      fg: text.primary,
      border: colors.error[600],
    },
    hover: {
      bg: colors.error[500],
      fg: text.primary,
      border: colors.error[500],
    },
    active: {
      bg: colors.error[800],
      fg: text.primary,
      border: colors.error[800],
    },
    subtle: {
      bg: colors.gray[900],
      fg: colors.error[300],
    },
    muted: {
      bg: colors.error[950],
      fg: colors.error[300],
    },
  },
} as const;
