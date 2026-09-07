import { colors } from '../../primitives/colors.js';
import { overlay as primitiveOverlay } from '../../primitives/overlay.js';

import { border } from './border.js';
import { surface } from './surface.js';

export const overlay = {
  backdrop: primitiveOverlay.backdropLight,

  tooltip: {
    bg: surface.elevated,
    fg: colors.vellira[700],
    border: border.muted,
  },

  floating: {
    bg: surface.elevated,
    border: border.muted,
  },

  dialog: {
    bg: surface.elevated,
    border: border.muted,
  },
} as const;
