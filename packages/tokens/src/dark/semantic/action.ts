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
      bg: colors.primary[600],
      fg: text.brand,
      border: colors.primary[300],
    },
  },

  secondary: {
    default: {
      bg: colors.secondary[600],
      fg: text.inverse,
      border: colors.secondary[600],
    },
    hover: {
      bg: colors.secondary[700],
      fg: text.inverse,
      border: colors.secondary[700],
    },
    active: {
      bg: colors.secondary[800],
      fg: text.inverse,
      border: colors.secondary[800],
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
