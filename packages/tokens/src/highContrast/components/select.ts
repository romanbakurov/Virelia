import { border } from '../semantic/border.js';
import { control } from '../semantic/control.js';
import { focus } from '../semantic/focus.js';
import { navigation } from '../semantic/navigation.js';
import { status } from '../semantic/status.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const select = {
  trigger: {
    default: {
      bg: surface.default,
      fg: text.primary,
      border: border.default,
    },

    hover: {
      bg: 'transparent',
      fg: text.primary,
      border: navigation.hover.bg,
    },

    focus: {
      bg: surface.default,
      fg: text.primary,
      border: border.focus,
      ring: focus.ring,
    },

    disabled: {
      bg: surface.subtle,
      fg: text.disabled,
      border: border.disabled,
    },

    placeholder: {
      fg: text.muted,
    },

    error: {
      border: status.error.fg,
      ring: status.error.bg,
    },
  },

  dropdown: {
    bg: surface.elevated,
    fg: text.primary,
    border: border.focus,
  },

  option: {
    default: {
      bg: 'transparent',
      fg: text.primary,
      border: border.muted,
    },

    hover: navigation.hover,

    active: {
      ...navigation.active,
      ring: 'transparent',
    },

    selected: {
      bg: control.selected.default.bg,
      fg: text.primary,
    },

    disabled: {
      bg: 'transparent',
      fg: text.disabled,
      border: border.disabled,
    },
  },
} as const;
