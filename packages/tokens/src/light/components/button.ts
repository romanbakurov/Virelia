import { action } from '../semantic/action.js';
import { border } from '../semantic/border.js';
import { status } from '../semantic/status.js';
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
        fg: action.primary.default.bg,
        border: action.primary.default.border,
      },
      hover: {
        bg: surface.hover,
        fg: action.primary.hover.bg,
        border: action.primary.hover.border,
      },
      pressed: {
        bg: surface.pressed,
        fg: action.primary.active.bg,
        border: action.primary.active.border,
      },
    },
    ghost: {
      default: {
        ...transparent,
        fg: action.primary.default.bg,
        border: 'transparent',
      },
      hover: {
        bg: action.primary.subtle.bg,
        fg: action.primary.hover.bg,
        border: 'transparent',
      },
      pressed: {
        bg: action.primary.subtle.bg,
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
        bg: surface.elevated,
        fg: action.secondary.hover.bg,
        border: action.secondary.hover.border,
      },
      pressed: {
        bg: surface.pressed,
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
        bg: surface.elevated,
        fg: action.secondary.hover.bg,
        border: 'transparent',
      },
      pressed: {
        bg: surface.pressed,
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
        fg: action.close.muted.bg,
        border: action.close.muted.border,
      },
      hover: {
        bg: surface.hover,
        fg: action.close.subtle.bg,
        border: action.close.subtle.border,
      },
      pressed: {
        bg: surface.pressed,
        fg: action.close.active.bg,
        border: action.close.active.border,
      },
    },
    ghost: {
      default: {
        ...transparent,
        fg: text.primary,
        border: 'transparent',
      },
      hover: {
        bg: action.primary.subtle.bg,
        fg: text.primary,
        border: 'transparent',
      },
      pressed: {
        bg: action.primary.subtle.bg,
        fg: text.primary,
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
        fg: action.danger.default.bg,
        border: action.danger.default.border,
      },
      hover: {
        bg: status.error.bg,
        fg: action.danger.hover.bg,
        border: action.danger.hover.border,
      },
      pressed: {
        bg: status.error.bg,
        fg: action.danger.active.bg,
        border: action.danger.active.border,
      },
    },
    ghost: {
      default: {
        ...transparent,
        fg: action.danger.default.bg,
        border: 'transparent',
      },
      hover: {
        bg: status.error.bg,
        fg: action.danger.hover.bg,
        border: 'transparent',
      },
      pressed: {
        bg: status.error.bg,
        fg: action.danger.active.bg,
        border: 'transparent',
      },
    },
  },

  disabled: {
    bg: surface.disabled,
    fg: text.disabled,
    border: border.default,
  },
} as const;
