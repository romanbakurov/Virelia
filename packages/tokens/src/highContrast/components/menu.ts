import { action } from '../semantic/action.js';
import { focus } from '../semantic/focus.js';
import { navigation } from '../semantic/navigation.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const menu = {
  item: {
    default: {
      bg: 'transparent',
      fg: text.primary,
    },

    hover: navigation.itemHover,

    active: navigation.itemActive,

    focus: {
      ring: focus.ring,
    },

    disabled: {
      bg: surface.muted,
      fg: text.disabled,
    },

    danger: {
      default: {
        fg: action.danger.default.bg,
      },

      hover: {
        bg: action.danger.subtle.bg,
        fg: action.danger.subtle.fg,
      },

      active: {
        bg: action.danger.muted.bg,
        fg: action.danger.muted.fg,
      },
    },
  },

  trigger: {
    default: {
      fg: text.primary,
    },

    hover: {
      bg: navigation.brandHover.bg,
      fg: navigation.brandHover.fg,
      ring: 'transparent',
    },
  },

  groupLabel: {
    fg: text.muted,
  },
} as const;
