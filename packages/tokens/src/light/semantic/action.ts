import { colors } from '../../primitives/colors.js';

import { text } from './text.js';

export const action = {
  primary: {
    default: {
      bg: colors.primary[700],
      fg: text.inverse,
      border: colors.primary[700],
    },
    hover: {
      bg: colors.primary[800],
      fg: text.inverse,
      border: colors.primary[800],
    },
    active: {
      bg: colors.primary[950],
      fg: text.inverse,
      border: colors.primary[950],
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
      bg: colors.secondary[500],
      fg: text.inverse,
      border: colors.secondary[500],
    },
    hover: {
      bg: colors.secondary[900],
      fg: text.inverse,
      border: colors.secondary[900],
    },
    active: {
      bg: colors.secondary[950],
      fg: text.inverse,
      border: colors.secondary[950],
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
      bg: colors.error[800],
      fg: text.inverse,
      border: colors.error[800],
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
