import { border } from '../semantic/border.js';
import { focus } from '../semantic/focus.js';
import { menu } from '../semantic/menu.js';
import { shadow } from '../semantic/shadow.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const dropdown = {
  trigger: {
    default: {
      bg: 'transparent',
      fg: text.interactive,
      border: 'transparent',
    },

    hover: {
      bg: surface.hover,
      fg: text.interactiveHover,
      border: 'transparent',
      ring: 'transparent',
    },

    focus: {
      bg: 'transparent',
      fg: text.interactive,
      border: border.focus,
      ring: focus.ring,
    },

    disabled: {
      bg: surface.disabled,
      fg: text.disabled,
      border: border.disabled,
    },
  },

  content: {
    bg: menu.background,
    fg: menu.item.default.fg,
    border: menu.border,
    shadow: shadow.lg,
  },

  item: {
    default: {
      bg: menu.item.default.bg,
      fg: menu.item.default.fg,
    },

    hover: {
      bg: menu.item.hover.bg,
      fg: menu.item.hover.fg,
    },

    active: {
      bg: menu.item.active.bg,
      fg: menu.item.active.fg,
      ring: 'transparent',
    },

    pressed: {
      bg: menu.item.pressed.bg,
      fg: menu.item.pressed.fg,
    },

    focus: {
      ring: focus.ring,
    },

    disabled: {
      bg: menu.item.disabled.bg,
      fg: menu.item.disabled.fg,
    },

    danger: {
      default: menu.item.danger.default,
      hover: menu.item.danger.hover,

      active: {
        ...menu.item.danger.active,
        ring: 'transparent',
      },

      disabled: menu.item.danger.disabled,
    },
  },

  groupLabel: {
    fg: text.secondary,
  },

  separator: {
    bg: border.muted,
    fg: text.muted,
  },
} as const;
