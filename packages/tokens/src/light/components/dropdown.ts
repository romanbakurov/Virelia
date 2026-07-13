import { action } from '../semantic/action.js';
import { border } from '../semantic/border.js';
import { focus } from '../semantic/focus.js';
import { navigation } from '../semantic/navigation.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const dropdown = {
  trigger: {
    default: {
      bg: 'transparent',
      fg: text.brand,
      border: 'transparent',
    },

    hover: {
      bg: navigation.brandHover.bg,
      fg: navigation.brandHover.fg,
      border: 'transparent',
      ring: 'transparent',
    },

    focus: {
      bg: 'transparent',
      fg: text.brand,
      border: border.focus,
      ring: focus.ring,
    },

    disabled: {
      bg: surface.disabled,
      fg: text.disabled,
      border: border.muted,
    },
  },

  content: {
    bg: surface.subtle,
    fg: text.primary,
    border: navigation.border,
  },

  item: {
    default: {
      bg: 'transparent',
      fg: text.primary,
    },

    hover: navigation.hover,

    active: {
      bg: navigation.hover.bg,
      fg: navigation.hover.fg,
      ring: 'transparent',
    },

    focus: {
      ring: focus.ring,
    },

    disabled: {
      bg: 'transparent',
      fg: text.disabled,
    },

    danger: {
      default: {
        fg: action.danger.subtle.fg,
      },

      hover: {
        bg: action.danger.subtle.bg,
        fg: action.danger.subtle.fg,
      },

      active: {
        bg: action.danger.default.bg,
        fg: action.danger.default.fg,
        ring: 'transparent',
      },
    },
  },

  groupLabel: {
    fg: text.muted,
  },

  separator: {
    bg: border.muted,
    fg: text.muted,
  },
} as const;
