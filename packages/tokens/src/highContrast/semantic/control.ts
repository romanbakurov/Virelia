import { colors } from '../../primitives/colors.js';

import { text } from './text.js';

export const control = {
  hover: {
    bg: colors.gray[900],
    fg: text.inverse,
    border: colors.primary[500],
  },
  radioHover: {
    bg: colors.gray[900],
    fg: colors.primary[500],
    border: colors.primary[300],
  },
  selected: {
    default: {
      bg: colors.primary[500],
      fg: text.primary,
      border: colors.primary[500],
    },
    hover: {
      bg: colors.info[500],
      fg: text.inverse,
      border: colors.info[500],
    },
    active: {
      bg: colors.primary[800],
      fg: text.inverse,
      border: colors.primary[800],
    },
    muted: {
      bg: colors.primary[600],
      fg: colors.mono[50],
      border: colors.primary[600],
    },
    radioDefault: {
      bg: colors.primary[400],
      fg: colors.primary[600],
      border: colors.primary[500],
    },
  },
} as const;
