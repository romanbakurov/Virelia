import { colors } from '../../primitives/colors.js';

import { border } from './border.js';
import { surface } from './surface.js';
import { text } from './text.js';

export const control = {
  default: {
    bg: surface.elevated,
    fg: text.primary,
    border: border.default,
  },

  hover: {
    bg: colors.primary[50],
    fg: colors.primary[800],
    border: colors.primary[700],
  },

  active: {
    bg: colors.primary[100],
    fg: colors.primary[900],
    border: colors.primary[800],
  },

  disabled: {
    bg: surface.disabled,
    fg: text.disabled,
    border: border.disabled,
  },

  selected: {
    default: {
      bg: colors.primary[600],
      fg: colors.mono[50],
      border: colors.primary[600],
    },

    hover: {
      bg: colors.primary[700],
      fg: colors.mono[50],
      border: colors.primary[700],
    },

    active: {
      bg: colors.primary[800],
      fg: colors.mono[50],
      border: colors.primary[800],
    },

    muted: {
      bg: colors.primary[100],
      fg: colors.primary[900],
      border: colors.primary[300],
    },
  },
} as const;
