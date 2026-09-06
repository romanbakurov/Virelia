import { colors } from '../../primitives/colors.js';

import { border } from './border.js';
import { surface } from './surface.js';
import { text } from './text.js';

export const control = {
  default: {
    bg: surface.default,
    fg: text.primary,
    border: border.default,
  },

  hover: {
    bg: surface.hover,
    fg: text.interactive,
    border: colors.warning[300],
  },

  pressed: {
    bg: surface.active,
    fg: text.primary,
    border: colors.warning[200],
  },

  disabled: {
    bg: surface.disabled,
    fg: text.disabled,
    border: border.disabled,
  },

  selected: {
    default: {
      bg: colors.warning[300],
      fg: colors.mono[950],
      border: colors.warning[300],
    },

    hover: {
      bg: colors.warning[200],
      fg: colors.mono[950],
      border: colors.warning[200],
    },

    pressed: {
      bg: colors.warning[400],
      fg: colors.mono[950],
      border: colors.warning[400],
    },

    muted: {
      bg: colors.gray[800],
      fg: colors.warning[200],
      border: colors.warning[300],
    },
  },
} as const;
