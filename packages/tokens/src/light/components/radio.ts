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
      bg: surface.elevated,
      fg: colors.primary[600],
      border: colors.primary[600],
      labelFg: text.interactive,
    },

    hover: {
      bg: colors.primary[50],
      fg: colors.primary[700],
      border: colors.primary[700],
      labelFg: text.interactiveHover,
    },

    pressed: {
      bg: colors.primary[100],
      fg: colors.primary[800],
      border: colors.primary[800],
      labelFg: text.interactiveActive,
    },

    disabled: {
      bg: surface.disabled,
      fg: text.disabled,
      border: border.disabled,
      labelFg: text.disabled,
    },
  },

  invalid: {
    ...control.default,
    border: status.error.border,
    ring: status.error.ring,
  },

  focus: {
    ring: focus.ring.color,
    border: border.focus,
  },

  disabled: control.disabled,
} as const;
