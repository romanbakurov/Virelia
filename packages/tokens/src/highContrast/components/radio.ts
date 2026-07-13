import { border } from '../semantic/border.js';
import { control } from '../semantic/control.js';
import { focus } from '../semantic/focus.js';
import { status } from '../semantic/status.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const radio = {
  default: {
    bg: surface.default,
    fg: text.inverse,
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
      border: border.disabled,
    },
  },

  focus: {
    ring: focus.ring,
    border: border.focus,
  },

  invalid: {
    bg: surface.default,
    fg: text.inverse,
    border: status.error.border,
  },

  disabled: {
    bg: surface.subtle,
    fg: text.disabled,
    border: border.disabled,
  },
} as const;
