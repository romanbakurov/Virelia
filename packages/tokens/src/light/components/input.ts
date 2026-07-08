import { border } from '../semantic/border.js';
import { control } from '../semantic/control.js';
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
    placeholder: text.muted,
    icon: icons.brand,
  },

  hover: {
    bg: control.hover.bg,
    fg: text.primary,
    border: control.hover.border,
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
    bg: surface.disabled,
    fg: text.disabled,
    border: border.disabled,
    placeholder: text.disabled,
    icon: icons.disabled,
  },

  error: {
    border: status.error.strong,
    ring: status.error.fg,
  },

  success: {
    border: status.success.strong,
    ring: status.success.fg,
  },

  readOnly: {
    bg: surface.subtle,
    fg: text.secondary,
    border: border.default,
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
  },

  clearButton: {
    fg: status.error.fg,
    hoverFg: status.error.fg,
    hoverBg: surface.danger,
    focusBg: surface.inverse,
    pressedBg: surface.active,
  },
} as const;
