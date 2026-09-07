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
    bg: surface.hover,
    fg: text.interactive,
    border: border.interactive,
  },

  pressed: {
    bg: surface.active,
    fg: text.interactive,
    border: colors.primary[300],
  },

  disabled: {
    bg: surface.disabled,
    fg: text.disabled,
    border: border.disabled,
  },

  selected: {
    default: {
      bg: colors.primary[500],
      fg: colors.mono[50],
      border: colors.primary[500],
    },

    hover: {
      bg: colors.primary[400],
      fg: colors.mono[50],
      border: colors.primary[400],
    },

    pressed: {
      bg: colors.primary[600],
      fg: colors.mono[50],
      border: colors.primary[600],
    },

    muted: {
      bg: colors.primary[800],
      fg: colors.primary[100],
      border: colors.primary[600],
    },
  },
} as const;
