import { border } from '../semantic/border.js';
import { focus } from '../semantic/focus.js';
import { icons } from '../semantic/icons.js';
import { status } from '../semantic/status.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const input = {
  default: {
    bg: 'transparent',
    fg: text.primary,
    border: border.elevated,
    placeholder: text.secondary,
    icon: icons.brand,
  },

  hover: {
    bg: surface.hover,
    fg: text.primary,
    border: border.focus,
    placeholder: text.muted,
    icon: icons.hover,
  },

  focus: {
    bg: 'transparent',
    fg: text.primary,
    border: border.focus,
    ring: focus.ring,
    placeholder: text.muted,
    icon: icons.subtle,
  },

  disabled: {
    bg: surface.elevated,
    fg: text.disabled,
    border: border.default,
    placeholder: text.disabled,
    icon: icons.disabled,
  },

  error: {
    border: status.error.border,
    ring: status.error.fg,
  },

  success: {
    border: status.success.strong,
    ring: status.success.fg,
  },
} as const;
