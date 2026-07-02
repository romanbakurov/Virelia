import { action } from '../semantic/action.js';
import { border } from '../semantic/border.js';
import { control } from '../semantic/control.js';
import { navigation } from '../semantic/navigation.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const tabs = {
  list: {
    border: border.default,
  },

  trigger: {
    default: {
      bg: 'transparent',
      fg: text.primary,
      border: 'transparent',
    },

    hover: {
      bg: 'transparent',
      fg: navigation.hover.bg,
      border: navigation.hover.bg,
    },

    active: {
      bg: 'transparent',
      fg: text.brand,
      border: action.primary.default.border,
    },

    focus: {
      ring: navigation.hover.bg,
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
      fg: text.primary,
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
      bg: control.selected.muted.bg,
    },

    active: {
      bg: text.brand,
    },
  },

  panel: {
    fg: text.primary,
  },
} as const;
