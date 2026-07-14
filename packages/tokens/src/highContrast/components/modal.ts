import { focus } from '../semantic/focus.js';
import { overlay } from '../semantic/overlay.js';
import { shadow } from '../semantic/shadow.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const modal = {
  overlay: {
    bg: overlay.backdrop,
  },

  content: {
    bg: overlay.modal.bg,
    fg: text.primary,
    border: overlay.modal.border,
    shadow: shadow.xl,
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
      fg: text.secondary,
      border: 'transparent',
    },

    hover: {
      bg: surface.hover,
      fg: text.primary,
      border: 'transparent',
    },

    pressed: {
      bg: surface.pressed,
      fg: text.primary,
      border: 'transparent',
    },

    focus: {
      ring: focus.ring.color,
    },

    disabled: {
      bg: 'transparent',
      fg: text.disabled,
      border: 'transparent',
    },
  },
} as const;
