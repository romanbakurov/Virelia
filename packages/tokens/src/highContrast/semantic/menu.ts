import { colors } from '../../primitives/colors.js';

import { status } from './status.js';
import { text } from './text.js';

export const menu = {
  background: colors.gray[900],
  border: colors.mono[50],

  item: {
    default: {
      bg: 'transparent',
      fg: text.primary,
    },

    hover: {
      bg: colors.warning[300],
      fg: colors.mono[950],
    },

    active: {
      bg: colors.warning[400],
      fg: colors.mono[950],
    },

    pressed: {
      bg: colors.warning[500],
      fg: colors.mono[950],
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
        bg: colors.error[400],
        fg: colors.mono[950],
      },

      active: {
        bg: colors.error[600],
        fg: colors.mono[50],
      },

      disabled: {
        bg: 'transparent',
        fg: text.disabled,
      },
    },
  },
} as const;
