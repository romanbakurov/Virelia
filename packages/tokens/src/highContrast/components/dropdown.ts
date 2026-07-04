import { border } from '../semantic/border.js';
import { focus } from '../semantic/focus.js';
import { navigation } from '../semantic/navigation.js';
import { status } from '../semantic/status.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const dropdown = {
  trigger: {
    default: {
      bg: 'transparent',
      fg: text.primary,
      border: 'transparent',
    },

    hover: {
      bg: 'transparent',
      fg: text.primary,
      border: navigation.hover.bg,
      ring: focus.ring,
    },

    focus: {
      bg: 'transparent',
      fg: text.primary,
      border: navigation.hover.bg,
      ring: focus.ring,
    },

    disabled: {
      bg: surface.muted,
      fg: text.disabled,
      border: border.muted,
    },
  },

  content: {
    bg: surface.elevated,
    fg: text.primary,
    border: navigation.border,
  },

  item: {
    default: {
      bg: 'transparent',
      fg: text.primary,
    },

    hover: navigation.itemHover,

    active: {
      bg: navigation.itemActive.bg,
      fg: navigation.itemActive.fg,
      ring: focus.ring,
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
        fg: status.error.fg,
      },

      hover: {
        bg: navigation.itemHover.bg,
        fg: status.error.fg,
      },

      active: {
        bg: navigation.itemActive.bg,
        fg: status.error.fg,
        ring: focus.ring,
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
