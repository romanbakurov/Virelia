import { colors } from '../../primitives/colors.js';

export const action = {
  primary: {
    default: {
      bg: colors.primary[500],
      fg: colors.mono[50],
      border: colors.mono[50],
    },
    hover: {
      bg: colors.primary[400],
      fg: colors.mono[950],
      border: colors.primary[200],
    },
    active: {
      bg: colors.primary[600],
      fg: colors.mono[50],
      border: colors.primary[300],
    },
    muted: {
      bg: colors.primary[950],
      fg: colors.primary[100],
      border: colors.primary[300],
    },
    subtle: {
      bg: colors.gray[900],
      fg: colors.primary[200],
      border: 'transparent',
    },
  },

  secondary: {
    default: {
      bg: colors.secondary[300],
      fg: colors.mono[950],
      border: colors.mono[50],
    },
    hover: {
      bg: colors.secondary[200],
      fg: colors.mono[950],
      border: colors.secondary[300],
    },
    active: {
      bg: colors.secondary[400],
      fg: colors.mono[950],
      border: colors.warning[300],
    },
    muted: {
      bg: colors.secondary[950],
      fg: colors.secondary[100],
      border: colors.secondary[300],
    },
    subtle: {
      bg: colors.gray[900],
      fg: colors.secondary[200],
      border: 'transparent',
    },
  },

  close: {
    default: {
      bg: colors.mono[50],
      fg: colors.mono[950],
      border: colors.mono[950],
    },
    hover: {
      bg: colors.gray[200],
      fg: colors.mono[950],
      border: colors.gray[950],
    },
    active: {
      bg: colors.gray[400],
      fg: colors.mono[950],
      border: colors.gray[950],
    },
    muted: {
      bg: colors.gray[800],
      fg: colors.mono[50],
      border: colors.gray[300],
    },
    subtle: {
      bg: colors.gray[900],
      fg: colors.mono[50],
      border: 'transparent',
    },
  },

  danger: {
    default: {
      bg: colors.error[600],
      fg: colors.mono[50],
      border: colors.mono[50],
    },
    hover: {
      bg: colors.error[500],
      fg: colors.mono[950],
      border: colors.warning[300],
    },
    active: {
      bg: colors.error[700],
      fg: colors.mono[50],
      border: colors.warning[300],
    },
    muted: {
      bg: colors.error[950],
      fg: colors.error[200],
      border: colors.error[300],
    },
    subtle: {
      bg: colors.gray[900],
      fg: colors.error[300],
      border: 'transparent',
    },
  },
} as const;
