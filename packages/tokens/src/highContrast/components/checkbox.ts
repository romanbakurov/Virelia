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
      bg: control.selected.default.bg,
      fg: control.selected.default.fg,
      border: control.selected.default.border,
      labelFg: text.interactive,
    },

    hover: {
      bg: control.selected.hover.bg,
      fg: control.selected.hover.fg,
      border: control.selected.hover.border,
      labelFg: text.interactiveHover,
    },

    pressed: {
      bg: control.selected.active.bg,
      fg: control.selected.active.fg,
      border: control.selected.active.border,
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
