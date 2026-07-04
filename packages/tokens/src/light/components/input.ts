import { border } from '../semantic/border.js';
import { control } from '../semantic/control.js';
import { focus } from '../semantic/focus.js';
import { status } from '../semantic/status.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const input = {
  default: {
    bg: 'transparent',
    fg: text.primary,
    border: border.default,
    placeholder: text.muted,
  },

  hover: {
    bg: control.hover.bg,
    fg: text.primary,
    border: control.hover.border,
    placeholder: text.muted,
  },

  focus: {
    bg: 'transparent',
    fg: text.primary,
    border: border.focus,
    ring: focus.ring,
    placeholder: text.muted,
  },

  disabled: {
    bg: surface.subtle,
    fg: text.disabled,
    border: border.default,
    placeholder: text.disabled,
  },

  error: {
    border: status.error.strong,
    ring: status.error.fg,
  },

  success: {
    border: status.success.strong,
    ring: status.success.fg,
  },
} as const;
