import { colors } from '../../primitives/colors.js';

import { text } from './text.js';

export const action = {
  primary: {
    default: {
      bg: colors.primary[600],
      fg: colors.mono[50],
      border: colors.primary[600],
    },
    hover: {
      bg: colors.primary[500],
      fg: colors.mono[50],
      border: colors.primary[500],
    },
    pressed: {
      bg: colors.primary[700],
      fg: colors.mono[50],
      border: colors.primary[700],
    },
    muted: {
      bg: colors.primary[900],
      fg: colors.mono[50],
      border: colors.primary[700],
    },
    subtle: {
      bg: colors.primary[200],
      fg: colors.primary[800],
      border: 'transparent',
    },
  },

  secondary: {
    default: {
      bg: colors.secondary[500],
      fg: text.inverse,
      border: colors.secondary[500],
    },
    hover: {
      bg: colors.secondary[400],
      fg: text.inverse,
      border: colors.secondary[400],
    },
    pressed: {
      bg: colors.secondary[600],
      fg: text.inverse,
      border: colors.secondary[600],
    },
    muted: {
      bg: colors.secondary[900],
      fg: colors.mono[50],
      border: colors.secondary[700],
    },
    subtle: {
      bg: colors.secondary[200],
      fg: colors.secondary[800],
      border: 'transparent',
    },
  },

  close: {
    default: {
      bg: colors.vellira[300],
      fg: text.inverse,
      border: colors.vellira[300],
    },
    hover: {
      bg: colors.vellira[200],
      fg: text.inverse,
      border: colors.vellira[200],
    },
    pressed: {
      bg: colors.vellira[500],
      fg: colors.mono[50],
      border: colors.vellira[500],
    },
    muted: {
      bg: colors.vellira[900],
      fg: colors.mono[50],
      border: colors.vellira[700],
    },
    subtle: {
      bg: colors.vellira[150],
      fg: text.secondary,
      border: 'transparent',
    },
  },

  danger: {
    default: {
      bg: colors.error[600],
      fg: colors.mono[50],
      border: colors.error[600],
    },

    hover: {
      bg: colors.error[500],
      fg: colors.mono[50],
      border: colors.error[500],
    },

    pressed: {
      bg: colors.error[700],
      fg: colors.mono[50],
      border: colors.error[700],
    },

    muted: {
      bg: colors.error[900],
      fg: colors.error[200],
      border: colors.error[700],
    },

    subtle: {
      bg: 'rgba(251, 113, 133, 0.16)',
      fg: colors.error[300],
      border: 'transparent',
    },
  },
} as const;
