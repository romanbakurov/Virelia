import { colors } from '../../primitives/colors.js';

import { text } from './text.js';

export const action = {
  primary: {
    default: {
      bg: colors.primary[600],
      fg: text.inverse,
      border: colors.primary[600],
    },
    hover: {
      bg: colors.primary[700],
      fg: text.inverse,
      border: colors.primary[700],
    },
    active: {
      bg: colors.primary[800],
      fg: text.inverse,
      border: colors.primary[800],
    },
    muted: {
      bg: colors.primary[500],
      fg: text.inverse,
      border: colors.primary[500],
    },
    subtle: {
      bg: colors.primary[50],
      fg: colors.primary[900],
      border: colors.primary[700],
    },
  },

  secondary: {
    default: {
      bg: colors.secondary[700],
      fg: text.inverse,
      border: colors.secondary[700],
    },
    hover: {
      bg: colors.secondary[800],
      fg: text.inverse,
      border: colors.secondary[800],
    },
    active: {
      bg: colors.secondary[900],
      fg: text.inverse,
      border: colors.secondary[900],
    },
    muted: {
      bg: colors.secondary[500],
      fg: text.inverse,
      border: colors.secondary[500],
    },
    subtle: {
      bg: colors.secondary[50],
      fg: text.inverse,
      border: colors.secondary[700],
    },
  },

  close: {
    default: {
      bg: colors.grayBlue[200],
      fg: text.onInverse,
      border: colors.grayBlue[200],
    },
    hover: {
      bg: colors.grayBlue[300],
      fg: text.onInverse,
      border: colors.grayBlue[300],
    },
    active: {
      bg: colors.grayBlue[400],
      fg: text.onInverse,
      border: colors.grayBlue[400],
    },
    muted: {
      bg: colors.grayBlue[600],
      fg: text.inverse,
      border: colors.grayBlue[600],
    },
    subtle: {
      bg: colors.grayBlue[500],
      fg: text.inverse,
      border: colors.grayBlue[500],
    },
  },

  danger: {
    default: {
      bg: colors.error[700],
      fg: text.inverse,
      border: colors.error[700],
    },
    hover: {
      bg: colors.error[800],
      fg: text.inverse,
      border: colors.error[800],
    },
    active: {
      bg: colors.error[900],
      fg: text.inverse,
      border: colors.error[900],
    },
    subtle: {
      bg: colors.error[50],
      fg: colors.error[700],
    },
    muted: {
      bg: colors.error[100],
      fg: colors.error[700],
    },
  },
} as const;
