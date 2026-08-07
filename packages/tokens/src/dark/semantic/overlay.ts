import { colors } from '../../primitives/colors.js';
import { overlay as primitiveOverlay } from '../../primitives/overlay.js';

import { border } from './border.js';
import { surface } from './surface.js';

export const overlay = {
  backdrop: primitiveOverlay.backdrop,

  tooltip: {
    bg: surface.elevated,
    fg: colors.vellira[100],
    border: border.default,
  },

  popover: {
    bg: surface.subtle,
    border: border.muted,
  },

  modal: {
    bg: surface.subtle,
    border: border.muted,
  },
} as const;
