import { colors } from '../../primitives/colors.js';
import { overlay as primitiveOverlay } from '../../primitives/overlay.js';

import { border } from './border.js';
import { surface } from './surface.js';

export const overlay = {
  backdrop: primitiveOverlay.backdrop,

  tooltip: {
    bg: colors.mono[50],
    fg: colors.mono[950],
    border: colors.warning[300],
  },

  popover: {
    bg: surface.muted,
    border: border.default,
  },

  modal: {
    bg: surface.muted,
    border: border.default,
  },
} as const;
