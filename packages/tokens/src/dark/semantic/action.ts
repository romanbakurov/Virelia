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
      bg: colors.primary[400],
      fg: text.inverse,
      border: colors.primary[400],
    },
    active: {
      bg: colors.primary[600],
      fg: text.inverse,
      border: colors.primary[600],
    },
    muted: {
      bg: colors.primary[300],
      fg: text.inverse,
      border: colors.primary[300],
    },
    subtle: {
      bg: colors.primary[200],
      fg: text.brand,
      border: colors.primary[200],
    },
  },

  secondary: {
    default: {
      bg: colors.secondary[300],
      fg: text.onInverse,
      border: colors.secondary[300],
    },
    hover: {
      bg: colors.secondary[400],
      fg: text.onInverse,
      border: colors.secondary[400],
    },
    active: {
      bg: colors.secondary[500],
      fg: text.onInverse,
      border: colors.secondary[500],
    },
  },

  close: {
    default: {
      bg: colors.vellira[200],
      fg: text.onInverse,
      border: colors.vellira[200],
    },
    hover: {
      bg: colors.vellira[300],
      fg: text.onInverse,
      border: colors.vellira[300],
    },
    active: {
      bg: colors.vellira[400],
      fg: text.onInverse,
      border: colors.vellira[400],
    },
  },

  danger: {
    default: {
      bg: colors.error[600],
      fg: text.inverse,
      border: colors.error[600],
    },
    hover: {
      bg: colors.error[700],
      fg: text.inverse,
      border: colors.error[700],
    },
    active: {
      bg: colors.error[800],
      fg: text.inverse,
      border: colors.error[800],
    },
    subtle: {
      bg: colors.error[950],
      fg: colors.error[300],
    },
    muted: {
      bg: colors.error[900],
      fg: colors.error[200],
    },
  },
} as const;
