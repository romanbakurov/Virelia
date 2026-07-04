import { border } from '../semantic/border.js';
import { control } from '../semantic/control.js';
import { focus } from '../semantic/focus.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const radio = {
  default: {
    bg: surface.default,
    fg: text.primary,
    border: border.default,
  },

  hover: control.radioHover,

  checked: {
    default: control.selected.radioDefault,
    hover: {
      ...control.selected.hover,
      fg: text.primary,
    },
    pressed: {
      ...control.selected.active,
      fg: text.primary,
    },
  },

  focus: {
    ring: focus.ring,
  },

  disabled: {
    bg: surface.subtle,
    fg: text.disabled,
    border: border.default,
  },
} as const;
