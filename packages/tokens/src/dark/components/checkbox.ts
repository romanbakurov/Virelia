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
    default: {
      ...control.selected.default,
      labelFg: text.brand,
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

  disabled: {
    bg: surface.disabled,
    fg: text.disabled,
    border: border.disabled,
  },

  error: {
    fg: status.error.fg,
    border: status.error.border,
    ring: status.error.ring,
  },
} as const;
