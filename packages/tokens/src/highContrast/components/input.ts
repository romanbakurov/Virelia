import { border } from '../semantic/border.js';
import { focus } from '../semantic/focus.js';
import { icons } from '../semantic/icons.js';
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
    icon: icons.brand,
  },

  hover: {
    bg: surface.hover,
    fg: navigation.hover.fg,
    border: navigation.hover.bg,
    placeholder: navigation.hover.fg,
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
    bg: surface.muted,
    fg: text.disabled,
    border: border.muted,
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
