import { border } from '../semantic/border.js';
import { control } from '../semantic/control.js';
import { focus } from '../semantic/focus.js';
import { status } from '../semantic/status.js';

export const radio = {
  default: control.default,

  hover: control.hover,

  pressed: control.active,

  checked: {
    default: control.selected.default,
    hover: control.selected.hover,
    pressed: control.selected.active,
    disabled: control.disabled,
  },

  focus: {
    ring: focus.ring,
    border: border.focus,
  },

  invalid: {
    ...control.default,
    border: status.error.border,
  },

  disabled: control.disabled,
} as const;
