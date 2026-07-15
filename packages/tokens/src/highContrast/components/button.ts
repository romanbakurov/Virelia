import { colors } from '../../primitives/colors.js';
import { action } from '../semantic/action.js';
import { border } from '../semantic/border.js';
import { status } from '../semantic/status.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

const transparent = {
  bg: 'transparent',
  border: 'transparent',
} as const;

export const button = {
  primary: {
    solid: {
      default: action.primary.default,
      hover: action.primary.hover,
      pressed: action.primary.active,
    },

    outline: {
      default: {
        bg: 'transparent',
        fg: colors.primary[300],
        border: colors.primary[300],
      },
      hover: {
        bg: action.primary.subtle.bg,
        fg: colors.primary[300],
        border: colors.warning[300],
      },
      pressed: {
        bg: action.primary.muted.bg,
        fg: colors.primary[400],
        border: colors.warning[300],
      },
    },

    ghost: {
      default: {
        ...transparent,
        fg: colors.primary[300],
      },
      hover: {
        ...transparent,
        bg: action.primary.subtle.bg,
        fg: colors.primary[300],
      },
      pressed: {
        ...transparent,
        bg: action.primary.muted.bg,
        fg: colors.primary[400],
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
        bg: 'transparent',
        fg: colors.secondary[300],
        border: colors.secondary[300],
      },
      hover: {
        bg: action.secondary.subtle.bg,
        fg: colors.secondary[400],
        border: colors.warning[400],
      },
      pressed: {
        bg: action.secondary.muted.bg,
        fg: colors.secondary[500],
        border: colors.warning[500],
      },
    },

    ghost: {
      default: {
        ...transparent,
        fg: colors.secondary[300],
      },
      hover: {
        ...transparent,
        bg: action.secondary.subtle.bg,
        fg: colors.secondary[400],
      },
      pressed: {
        ...transparent,
        bg: action.secondary.muted.bg,
        fg: colors.secondary[500],
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
        bg: 'transparent',
        fg: text.primary,
        border: border.default,
      },
      hover: {
        bg: action.close.subtle.bg,
        fg: text.primary,
        border: colors.warning[300],
      },
      pressed: {
        bg: action.close.muted.bg,
        fg: text.primary,
        border: colors.warning[300],
      },
    },

    ghost: {
      default: {
        ...transparent,
        fg: text.primary,
      },
      hover: {
        ...transparent,
        bg: action.close.subtle.bg,
        fg: text.primary,
      },
      pressed: {
        ...transparent,
        bg: action.close.muted.bg,
        fg: text.primary,
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
        bg: 'transparent',
        fg: status.error.fg,
        border: status.error.border,
      },
      hover: {
        bg: status.error.bg,
        fg: status.error.strong,
        border: colors.warning[300],
      },
      pressed: {
        bg: action.danger.muted.bg,
        fg: status.error.strong,
        border: colors.warning[300],
      },
    },

    ghost: {
      default: {
        ...transparent,
        fg: status.error.fg,
      },
      hover: {
        ...transparent,
        bg: status.error.bg,
        fg: status.error.strong,
      },
      pressed: {
        ...transparent,
        bg: action.danger.muted.bg,
        fg: status.error.strong,
      },
    },
  },

  disabled: {
    bg: surface.disabled,
    fg: text.disabled,
    border: border.disabled,
  },
} as const;
