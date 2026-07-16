import { control } from '../semantic/control.js';
import { focus } from '../semantic/focus.js';
import { status } from '../semantic/status.js';
import { text } from '../semantic/text.js';

export const checkbox = {
  default: control.default,

  hover: {
    ...control.hover,
    labelFg: text.interactiveHover,
  },

  checked: {
    default: {
      ...control.selected.default,
      labelFg: text.interactive,
    },

    hover: {
      ...control.selected.hover,
      labelFg: text.interactiveHover,
    },

    pressed: {
      ...control.selected.active,
      labelFg: text.interactiveActive,
    },
  },

  focus: {
    ring: focus.ring.color,
  },

  disabled: control.disabled,

  error: {
    fg: status.error.fg,
    border: status.error.border,
    ring: status.error.ring,
  },
} as const;
