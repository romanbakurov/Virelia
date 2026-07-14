import { border } from '../semantic/border.js';
import { control } from '../semantic/control.js';
import { focus } from '../semantic/focus.js';
import { status } from '../semantic/status.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const checkbox = {
  default: {
    bg: surface.elevated,
    fg: text.primary,
    border: border.default,
  },

  hover: {
    bg: control.hover.bg,
    fg: control.hover.fg,
    border: control.hover.border,
  },

  checked: {
    default: control.selected.default,
    hover: control.selected.hover,
    pressed: control.selected.active,
  },

  focus: {
    ring: focus.ring,
  },

  disabled: {
    bg: surface.disabled,
    fg: text.disabled,
    border: border.disabled,
  },

  error: {
    fg: status.error.fg,
    border: status.error.border,
  },
} as const;
