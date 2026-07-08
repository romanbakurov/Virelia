import { border } from '../semantic/border.js';
import { control } from '../semantic/control.js';
import { focus } from '../semantic/focus.js';
import { status } from '../semantic/status.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const checkbox = {
  default: control.default,

  hover: control.hover,

  checked: {
    default: control.selected.default,
    hover: control.selected.hover,
    pressed: control.selected.active,
  },

  focus: {
    ring: focus.ring,
  },

  disabled: {
    bg: surface.subtle,
    fg: text.disabled,
    border: border.muted,
  },

  error: {
    fg: status.error.fg,
    border: status.error.fg,
  },
} as const;
