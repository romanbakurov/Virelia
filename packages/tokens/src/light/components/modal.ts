import { overlay } from '../../semantic/overlay.js';
import { border } from '../semantic/border.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const modal = {
  overlay: {
    bg: overlay.backdrop,
  },

  content: {
    bg: surface.elevated,
    fg: text.primary,
    border: border.default,
  },

  title: {
    fg: text.primary,
  },

  description: {
    fg: text.secondary,
  },

  closeButton: {
    default: {
      bg: 'transparent',
      fg: text.muted,
    },

    hover: {
      bg: surface.subtle,
      fg: text.primary,
    },

    disabled: {
      bg: 'transparent',
      fg: text.disabled,
    },
  },
} as const;
