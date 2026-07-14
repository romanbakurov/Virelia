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
    border: border.default,
    placeholder: text.secondary,
    icon: icons.brand,
  },

  hover: {
    bg: surface.subtle,
    fg: text.primary,
    border: border.focus,
    placeholder: text.secondary,
    icon: icons.hover,
  },

  focus: {
    bg: 'transparent',
    fg: text.primary,
    border: border.focus,
    ring: focus.ring,
    placeholder: text.secondary,
    icon: icons.brand,
  },

  disabled: {
    bg: surface.disabled,
    fg: text.disabled,
    border: border.disabled,
    placeholder: text.disabled,
    icon: icons.disabled,
  },

  error: {
    border: status.error.border,
    ring: status.error.fg,
  },

  success: {
    border: status.success.border,
    ring: status.success.fg,
  },

  readOnly: {
    bg: surface.subtle,
    fg: text.secondary,
    border: border.muted,
    placeholder: text.muted,
    icon: icons.muted,
  },

  icon: {
    default: icons.default,
    primary: icons.primary,
    secondary: icons.secondary,
    success: icons.success,
    danger: icons.danger,
    muted: icons.muted,
    inverse: icons.inverse,
    brand: icons.brand,
  },

  clearButton: {
    fg: icons.muted,
    hoverFg: status.error.fg,
    hoverBg: status.error.bg,
    focusBg: surface.subtle,
    pressedBg: surface.active,
  },
} as const;
