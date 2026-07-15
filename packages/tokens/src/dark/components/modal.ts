import { overlay } from '../../semantic/overlay.js';
import { border } from '../semantic/border.js';
import { focus } from '../semantic/focus.js';
import { shadow } from '../semantic/shadow.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const modal = {
  overlay: {
    bg: overlay.backdrop,
  },

  content: {
    bg: surface.subtle,
    fg: text.primary,
    border: border.muted,
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
      bg: surface.elevated,
      fg: text.primary,
      border: 'transparent',
    },

    pressed: {
      bg: surface.active,
      fg: text.primary,
      border: 'transparent',
    },

    focus: {
      ring: focus.ring,
    },

    disabled: {
      bg: 'transparent',
      fg: text.disabled,
      border: 'transparent',
    },
  },
} as const;
