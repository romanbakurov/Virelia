import { colors } from '../../primitives/colors.js';
import { border } from '../semantic/border.js';
import { control } from '../semantic/control.js';
import { focus } from '../semantic/focus.js';
import { status } from '../semantic/status.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const radio = {
  default: control.default,
  hover: control.hover,
  pressed: control.active,

  checked: {
    default: {
      bg: surface.default,
      fg: colors.warning[300],
      border: colors.warning[300],
      labelFg: text.interactive,
    },

    hover: {
      bg: surface.hover,
      fg: colors.warning[200],
      border: colors.warning[200],
      labelFg: text.interactiveHover,
    },

    pressed: {
      bg: surface.active,
      fg: colors.warning[400],
      border: colors.warning[400],
      labelFg: text.interactiveActive,
    },

    disabled: {
      bg: surface.disabled,
      fg: text.disabled,
      border: border.disabled,
      labelFg: text.disabled,
    },
  },

  focus: {
    ring: focus.ring.color,
    border: border.focus,
  },

  invalid: {
    ...control.default,
    border: status.error.border,
  },

  disabled: control.disabled,
} as const;
