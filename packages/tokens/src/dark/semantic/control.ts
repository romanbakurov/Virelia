import { colors } from '../../primitives/colors.js';

import { border } from './border.js';
import { surface } from './surface.js';
import { text } from './text.js';

export const control = {
  default: {
    bg: surface.elevated,
    fg: text.inverse,
    border: border.subtle,
  },
  hover: {
    bg: surface.hover,
    fg: text.brand,
    border: colors.primary[300],
  },
  active: {
    bg: colors.primary[100],
    fg: colors.primary[900],
    border: colors.primary[800],
  },
  selected: {
    default: {
      bg: colors.primary[400],
      fg: text.inverse,
      border: colors.primary[400],
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
      bg: colors.primary[700],
      fg: text.inverse,
      border: colors.primary[500],
    },
  },
} as const;
