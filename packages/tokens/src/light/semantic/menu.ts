import { colors } from '../../primitives/colors.js';

import { status } from './status.js';
import { text } from './text.js';

export const menu = {
  background: colors.mono[50],
  border: colors.vellira[200],

  item: {
    default: {
      bg: 'transparent',
      fg: text.primary,
    },

    hover: {
      bg: colors.vellira[100],
      fg: text.primary,
    },

    active: {
      bg: colors.vellira[150],
      fg: text.primary,
    },

    pressed: {
      bg: colors.vellira[200],
      fg: text.primary,
    },

    disabled: {
      bg: 'transparent',
      fg: text.disabled,
    },

    danger: {
      default: {
        bg: 'transparent',
        fg: status.error.fg,
      },

      hover: {
        bg: status.error.bg,
        fg: status.error.fg,
      },

      active: {
        bg: colors.error[100],
        fg: status.error.emphasisFg,
      },

      disabled: {
        bg: 'transparent',
        fg: text.disabled,
      },
    },
  },
} as const;
