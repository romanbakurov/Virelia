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
      ring: focus.ring.color,
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
    default: menu.item.default,
    hover: menu.item.hover,

    active: {
      ...menu.item.active,
      ring: 'transparent',
    },

    pressed: menu.item.pressed,

    focus: {
      ring: focus.ring.color,
    },

    disabled: menu.item.disabled,

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
