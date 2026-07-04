import { border } from '../semantic/border.js';
import { focus } from '../semantic/focus.js';
import { navigation } from '../semantic/navigation.js';
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
    bg: navigation.hover.bg,
    fg: navigation.hover.fg,
    border: navigation.hover.bg,
    placeholder: navigation.hover.fg,
  },

  focus: {
    bg: 'transparent',
    fg: text.primary,
    border: border.focus,
    ring: focus.ring,
    placeholder: text.muted,
  },

  disabled: {
    bg: surface.muted,
    fg: text.disabled,
    border: border.muted,
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
