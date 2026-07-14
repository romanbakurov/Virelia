import { colors } from '../../primitives/colors.js';

import { status } from './status.js';
import { text } from './text.js';

export const menu = {
  background: colors.vellira[800],
  border: colors.vellira[600],

  item: {
    default: {
      bg: 'transparent',
      fg: text.primary,
    },

    hover: {
      bg: colors.vellira[700],
      fg: text.primary,
    },

    active: {
      bg: colors.vellira[700],
      fg: text.primary,
    },

    pressed: {
      bg: colors.vellira[600],
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
        bg: status.error.bg,
        fg: status.error.fg,
      },

      disabled: {
        bg: 'transparent',
        fg: text.disabled,
      },
    },
  },
} as const;
