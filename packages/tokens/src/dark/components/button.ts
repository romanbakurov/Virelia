import { action } from '../semantic/action.js';
import { border } from '../semantic/border.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

const transparent = {
  bg: 'transparent',
};

export const button = {
  primary: {
    solid: {
      default: action.primary.default,
      hover: action.primary.hover,
      pressed: action.primary.active,
    },
    outline: {
      default: {
        ...transparent,
        fg: action.primary.muted.bg,
        border: action.primary.muted.border,
      },
      hover: {
        ...transparent,
        fg: action.primary.hover.bg,
        border: action.primary.hover.border,
      },
      pressed: {
        ...transparent,
        fg: action.primary.active.bg,
        border: action.primary.active.border,
      },
    },
    ghost: {
      default: {
        ...transparent,
        fg: action.primary.muted.bg,
        border: 'transparent',
      },
      hover: {
        ...transparent,
        fg: action.primary.hover.bg,
        border: 'transparent',
      },
      pressed: {
        ...transparent,
        fg: action.primary.active.bg,
        border: 'transparent',
      },
    },
  },

  secondary: {
    solid: {
      default: action.secondary.default,
      hover: action.secondary.hover,
      pressed: action.secondary.active,
    },
    outline: {
      default: {
        ...transparent,
        fg: action.secondary.default.bg,
        border: action.secondary.default.border,
      },
      hover: {
        ...transparent,
        fg: action.secondary.hover.bg,
        border: action.secondary.hover.border,
      },
      pressed: {
        ...transparent,
        fg: action.secondary.active.bg,
        border: action.secondary.active.border,
      },
    },
    ghost: {
      default: {
        ...transparent,
        fg: action.secondary.default.bg,
        border: 'transparent',
      },
      hover: {
        ...transparent,
        fg: action.secondary.hover.bg,
        border: 'transparent',
      },
      pressed: {
        ...transparent,
        fg: action.secondary.active.bg,
        border: 'transparent',
      },
    },
  },

  close: {
    solid: {
      default: action.close.default,
      hover: action.close.hover,
      pressed: action.close.active,
    },
    outline: {
      default: {
        ...transparent,
        fg: action.close.default.bg,
        border: action.close.default.border,
      },
      hover: {
        ...transparent,
        fg: action.close.hover.bg,
        border: action.close.hover.border,
      },
      pressed: {
        ...transparent,
        fg: action.close.active.bg,
        border: action.close.active.border,
      },
    },
    ghost: {
      default: {
        ...transparent,
        fg: action.close.default.bg,
        border: 'transparent',
      },
      hover: {
        ...transparent,
        fg: action.close.hover.bg,
        border: 'transparent',
      },
      pressed: {
        ...transparent,
        fg: action.close.active.bg,
        border: 'transparent',
      },
    },
  },

  danger: {
    solid: {
      default: action.danger.default,
      hover: action.danger.hover,
      pressed: action.danger.active,
    },
    outline: {
      default: {
        ...transparent,
        fg: action.danger.subtle.bg,
        border: action.danger.subtle.border,
      },
      hover: {
        ...transparent,
        fg: action.danger.hover.bg,
        border: action.danger.hover.border,
      },
      pressed: {
        ...transparent,
        fg: action.danger.active.bg,
        border: action.danger.active.border,
      },
    },
    ghost: {
      default: {
        ...transparent,
        fg: action.danger.subtle.bg,
        border: 'transparent',
      },
      hover: {
        ...transparent,
        fg: action.danger.hover.bg,
        border: 'transparent',
      },
      pressed: {
        ...transparent,
        fg: action.danger.active.bg,
        border: 'transparent',
      },
    },
  },

  disabled: {
    bg: surface.subtle,
    fg: text.disabled,
    border: border.default,
  },
} as const;
