import { border } from '../semantic/border.js';
import { control } from '../semantic/control.js';
import { focus } from '../semantic/focus.js';
import { status } from '../semantic/status.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const radio = {
  default: {
    bg: surface.default,
    fg: text.primary,
    border: border.default,
  },

  hover: control.hover,

  pressed: control.active,

  checked: {
    default: {
      ...control.selected.default,
      fg: text.brand,
    },

    hover: {
      ...control.selected.hover,
      fg: text.brand,
    },

    pressed: {
      ...control.selected.active,
      fg: text.brand,
    },

    disabled: {
      bg: surface.subtle,
      fg: text.disabled,
      border: border.default,
    },
  },

  invalid: {
    bg: surface.default,
    fg: text.onInverse,
    border: status.error.border,
  },

  focus: {
    ring: focus.ring,
    border: border.focus,
  },

  disabled: {
    bg: surface.subtle,
    fg: text.disabled,
    border: border.default,
  },
} as const;
