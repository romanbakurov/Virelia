import { focus } from '../semantic/focus.js';
import { menu as semanticMenu } from '../semantic/menu.js';
import { shadow } from '../semantic/shadow.js';
import { text } from '../semantic/text.js';

export const contextMenu = {
  content: {
    bg: semanticMenu.background,
    border: semanticMenu.border,
    shadow: shadow.lg,
  },

  item: {
    default: semanticMenu.item.default,
    hover: semanticMenu.item.hover,

    active: {
      ...semanticMenu.item.active,
      ring: 'transparent',
    },

    pressed: semanticMenu.item.pressed,

    focus: {
      ring: focus.ring.color,
    },

    disabled: semanticMenu.item.disabled,
    danger: semanticMenu.item.danger,
  },

  trigger: {
    default: {
      bg: 'transparent',
      fg: text.interactive,
      border: 'transparent',
    },

    hover: {
      bg: semanticMenu.item.hover.bg,
      fg: text.interactiveHover,
      border: 'transparent',
      ring: 'transparent',
    },

    focus: {
      bg: 'transparent',
      fg: text.interactive,
      border: 'transparent',
      ring: focus.ring.color,
    },

    disabled: {
      bg: 'transparent',
      fg: text.disabled,
      border: 'transparent',
    },
  },

  groupLabel: {
    fg: text.secondary,
  },
} as const;
