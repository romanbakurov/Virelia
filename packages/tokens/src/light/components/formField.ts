import { status } from '../semantic/status.js';
import { text } from '../semantic/text.js';

export const formField = {
  label: {
    fg: text.secondary,
  },

  description: {
    fg: text.muted,
  },

  helperText: {
    default: {
      fg: text.muted,
    },

    error: {
      fg: status.error.fg,
    },

    success: {
      fg: status.success.fg,
    },

    warning: {
      fg: status.warning.fg,
    },

    info: {
      fg: status.info.fg,
    },
  },

  requiredMark: {
    fg: status.error.fg,
  },

  disabled: {
    labelFg: text.disabled,
    descriptionFg: text.disabled,
    helperTextFg: text.disabled,
  },
} as const;
