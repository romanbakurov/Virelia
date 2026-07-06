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
      bg: colors.primary[500],
      fg: text.primary,
      border: colors.primary[500],
    },
    active: {
      bg: colors.primary[400],
      fg: text.primary,
      border: colors.primary[400],
    },
    muted: {
      bg: colors.primary[300],
      fg: colors.mono[50],
      border: colors.primary[300],
    },
    subtle: {
      bg: colors.primary[200],
      fg: text.inverse,
      border: colors.primary[200],
    },
  },

  secondary: {
    default: {
      bg: colors.secondary[400],
      fg: text.inverse,
      border: colors.secondary[400],
    },
    hover: {
      bg: colors.secondary[300],
      fg: text.inverse,
      border: colors.secondary[300],
    },
    active: {
      bg: colors.secondary[200],
      fg: text.inverse,
      border: colors.secondary[200],
    },
    muted: {
      bg: colors.secondary[300],
      fg: colors.mono[50],
      border: colors.secondary[300],
    },
    subtle: {
      bg: colors.secondary[200],
      fg: text.inverse,
      border: colors.secondary[200],
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
    muted: {
      bg: colors.error[400],
      fg: colors.error[400],
      border: colors.error[400],
    },
    subtle: {
      bg: colors.error[300],
      fg: colors.error[300],
      border: colors.error[300],
    },
  },
} as const;
