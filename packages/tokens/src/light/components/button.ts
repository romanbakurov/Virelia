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
        fg: colors.primary[700],
        border: colors.primary[600],
      },

      hover: {
        bg: action.primary.subtle.bg,
        fg: colors.primary[800],
        border: colors.primary[700],
      },

      pressed: {
        bg: action.primary.muted.bg,
        fg: colors.primary[900],
        border: colors.primary[800],
      },
    },

    ghost: {
      default: {
        ...transparent,
        fg: colors.primary[700],
      },

      hover: {
        ...transparent,
        bg: action.primary.subtle.bg,
        fg: colors.primary[800],
      },

      pressed: {
        ...transparent,
        bg: action.primary.muted.bg,
        fg: colors.primary[900],
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
        fg: colors.secondary[700],
        border: colors.secondary[700],
      },

      hover: {
        bg: action.secondary.subtle.bg,
        fg: colors.secondary[800],
        border: colors.secondary[800],
      },

      pressed: {
        bg: action.secondary.muted.bg,
        fg: colors.secondary[900],
        border: colors.secondary[900],
      },
    },

    ghost: {
      default: {
        ...transparent,
        fg: colors.secondary[700],
      },

      hover: {
        ...transparent,
        bg: action.secondary.subtle.bg,
        fg: colors.secondary[800],
      },

      pressed: {
        ...transparent,
        bg: action.secondary.muted.bg,
        fg: colors.secondary[900],
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
        fg: colors.vellira[700],
        border: colors.vellira[400],
      },

      hover: {
        bg: action.close.subtle.bg,
        fg: colors.vellira[800],
        border: colors.vellira[500],
      },

      pressed: {
        bg: action.close.muted.bg,
        fg: colors.vellira[900],
        border: colors.vellira[600],
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
        fg: colors.vellira[800],
      },

      pressed: {
        ...transparent,
        bg: action.close.muted.bg,
        fg: colors.vellira[900],
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
        fg: colors.error[800],
        border: colors.error[700],
      },

      pressed: {
        bg: action.danger.muted.bg,
        fg: colors.error[900],
        border: colors.error[800],
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
        fg: colors.error[800],
      },

      pressed: {
        ...transparent,
        bg: action.danger.muted.bg,
        fg: colors.error[900],
      },
    },
  },

  disabled: {
    bg: surface.disabled,
    fg: text.disabled,
    border: border.disabled,
  },
} as const;
