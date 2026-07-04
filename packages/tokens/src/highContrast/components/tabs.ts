import { action } from '../semantic/action.js';
import { border } from '../semantic/border.js';
import { navigation } from '../semantic/navigation.js';
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
      bg: navigation.hover.bg,
      fg: text.inverse,
      border: 'transparent',
    },

    active: {
      bg: action.primary.muted.bg,
      fg: action.primary.muted.fg,
      border: action.primary.muted.border,
    },

    disabled: {
      bg: 'transparent',
      fg: text.disabled,
      border: 'transparent',
    },
  },

  indicator: {
    default: {
      bg: navigation.hover.bg,
    },

    hover: {
      bg: navigation.hover.bg,
    },

    active: {
      bg: text.brand,
    },
  },

  panel: {
    fg: text.primary,
  },
} as const;
