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
      bg: colors.primary[100],
      fg: colors.primary[900],
      border: colors.primary[300],
    },
    subtle: {
      bg: colors.primary[50],
      fg: colors.primary[900],
      border: 'transparent',
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
      bg: colors.secondary[100],
      fg: colors.secondary[900],
      border: colors.secondary[300],
    },
    subtle: {
      bg: colors.secondary[50],
      fg: colors.secondary[900],
      border: 'transparent',
    },
  },

  close: {
    default: {
      bg: colors.vellira[250],
      fg: colors.vellira[900],
      border: colors.vellira[250],
    },
    hover: {
      bg: colors.vellira[300],
      fg: colors.vellira[950],
      border: colors.vellira[300],
    },
    active: {
      bg: colors.vellira[400],
      fg: text.inverse,
      border: colors.vellira[400],
    },
    muted: {
      bg: colors.vellira[150],
      fg: colors.vellira[800],
      border: colors.vellira[300],
    },
    subtle: {
      bg: colors.vellira[100],
      fg: colors.vellira[700],
      border: 'transparent',
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
    muted: {
      bg: colors.error[100],
      fg: colors.error[800],
      border: colors.error[300],
    },
    subtle: {
      bg: colors.error[50],
      fg: colors.error[700],
      border: 'transparent',
    },
  },
} as const;
