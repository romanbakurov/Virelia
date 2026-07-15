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
        border: colors.primary[500],
      },

      hover: {
        bg: surface.elevated,
        fg: colors.primary[200],
        border: colors.primary[400],
      },

      pressed: {
        bg: surface.active,
        fg: colors.primary[100],
        border: colors.primary[500],
      },
    },

    ghost: {
      default: {
        ...transparent,
        fg: colors.primary[300],
      },

      hover: {
        ...transparent,
        bg: surface.elevated,
        fg: colors.primary[200],
      },

      pressed: {
        ...transparent,
        bg: surface.active,
        fg: colors.primary[100],
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
        border: colors.secondary[500],
      },

      hover: {
        bg: surface.elevated,
        fg: colors.secondary[200],
        border: colors.secondary[400],
      },

      pressed: {
        bg: surface.active,
        fg: colors.secondary[100],
        border: colors.secondary[500],
      },
    },

    ghost: {
      default: {
        ...transparent,
        fg: colors.secondary[300],
      },

      hover: {
        ...transparent,
        bg: surface.elevated,
        fg: colors.secondary[200],
      },

      pressed: {
        ...transparent,
        bg: surface.active,
        fg: colors.secondary[100],
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
        fg: colors.vellira[300],
        border: colors.vellira[500],
      },

      hover: {
        bg: surface.elevated,
        fg: colors.vellira[200],
        border: colors.vellira[400],
      },

      pressed: {
        bg: surface.active,
        fg: colors.vellira[100],
        border: colors.vellira[500],
      },
    },

    ghost: {
      default: {
        ...transparent,
        fg: colors.vellira[300],
      },

      hover: {
        ...transparent,
        bg: surface.elevated,
        fg: colors.vellira[200],
      },

      pressed: {
        ...transparent,
        bg: surface.active,
        fg: colors.vellira[100],
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
        fg: colors.error[300],
        border: colors.error[400],
      },

      pressed: {
        bg: surface.danger,
        fg: colors.error[200],
        border: colors.error[500],
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
        fg: colors.error[300],
      },

      pressed: {
        ...transparent,
        bg: surface.danger,
        fg: colors.error[200],
      },
    },
  },

  disabled: {
    bg: surface.disabled,
    fg: text.disabled,
    border: border.disabled,
  },
} as const;
