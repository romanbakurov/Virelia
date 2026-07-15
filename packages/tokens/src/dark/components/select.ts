import { border } from '../semantic/border.js';
import { control } from '../semantic/control.js';
import { focus } from '../semantic/focus.js';
import { menu } from '../semantic/menu.js';
import { shadow } from '../semantic/shadow.js';
import { status } from '../semantic/status.js';
import { text } from '../semantic/text.js';

export const select = {
  trigger: {
    default: {
      bg: 'transparent',
      fg: text.primary,
      border: border.default,
    },

    hover: control.hover,

    focus: {
      bg: 'transparent',
      fg: text.primary,
      border: border.focus,
      ring: focus.ring.color,
    },

    disabled: control.disabled,

    placeholder: {
      fg: text.secondary,
    },

    error: {
      border: status.error.border,
      ring: status.error.ring,
    },
  },

  dropdown: {
    bg: menu.background,
    fg: menu.item.default.fg,
    border: menu.border,
    shadow: shadow.lg,
  },

  option: {
    default: {
      bg: menu.item.default.bg,
      fg: menu.item.default.fg,
      border: 'transparent',
    },

    hover: {
      bg: menu.item.hover.bg,
      fg: menu.item.hover.fg,
      border: 'transparent',
    },

    active: {
      bg: menu.item.active.bg,
      fg: menu.item.active.fg,
      border: 'transparent',
      ring: 'transparent',
    },

    pressed: {
      bg: menu.item.pressed.bg,
      fg: menu.item.pressed.fg,
      border: 'transparent',
    },

    selected: {
      bg: control.selected.muted.bg,
      fg: control.selected.muted.fg,
      border: control.selected.muted.border,
      shadow: shadow.inset,
    },

    disabled: {
      bg: menu.item.disabled.bg,
      fg: menu.item.disabled.fg,
      border: 'transparent',
    },
  },
} as const;
