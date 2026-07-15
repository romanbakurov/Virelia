import { action } from '../semantic/action.js';
import { border } from '../semantic/border.js';
import { control } from '../semantic/control.js';
import { focus } from '../semantic/focus.js';
import { navigation } from '../semantic/navigation.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const tabs = {
  list: {
    border: border.muted,
  },

  trigger: {
    default: {
      bg: 'transparent',
      fg: text.secondary,
      border: 'transparent',
    },

    hover: {
      bg: 'transparent',
      fg: navigation.tabHover.fg,
      border: 'transparent',
    },

    active: {
      bg: 'transparent',
      fg: text.brand,
      border: action.primary.default.border,
    },

    focus: {
      ring: focus.ring,
    },

    disabled: {
      bg: 'transparent',
      fg: text.disabled,
      border: 'transparent',
    },
  },

  pills: {
    default: {
      bg: 'transparent',
      fg: text.secondary,
      border: 'transparent',
    },

    hover: {
      bg: surface.hover,
      fg: text.primary,
      border: 'transparent',
    },

    active: {
      bg: control.selected.muted.bg,
      fg: control.selected.muted.fg,
      border: control.selected.muted.border,
    },

    disabled: {
      bg: 'transparent',
      fg: text.disabled,
      border: 'transparent',
    },
  },

  indicator: {
    default: {
      bg: text.brand,
    },

    hover: {
      bg: action.primary.hover.bg,
    },

    active: {
      bg: action.primary.default.bg,
    },
  },

  panel: {
    fg: text.primary,
  },
} as const;
