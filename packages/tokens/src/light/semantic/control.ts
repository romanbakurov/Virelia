import { colors } from '../../primitives/colors.js';

import { border } from './border.js';
import { surface } from './surface.js';
import { text } from './text.js';

export const control = {
  default: {
    bg: surface.default,
    fg: text.primary,
    border: border.subtle,
  },
  hover: {
    bg: colors.primary[50],
    fg: colors.primary[900],
    border: colors.primary[700],
  },
  selected: {
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
      bg: colors.primary[700],
      fg: text.inverse,
      border: colors.primary[500],
    },
  },
} as const;
