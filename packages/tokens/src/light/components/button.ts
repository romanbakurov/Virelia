import { action } from '../semantic/action.js';
import { border } from '../semantic/border.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const button = {
  primary: {
    default: action.primary.default,
    hover: action.primary.hover,
    pressed: action.primary.active,
  },

  secondary: {
    default: action.secondary.default,
    hover: action.secondary.hover,
    pressed: action.secondary.active,
  },

  danger: {
    default: action.danger.default,
    hover: action.danger.hover,
    pressed: action.danger.active,
  },

  disabled: {
    bg: surface.subtle,
    fg: text.disabled,
    border: border.muted,
  },
} as const;
