import { colors } from '../../primitives/colors.js';

import { border } from './border.js';
import { surface } from './surface.js';

export const overlay = {
  backdrop: 'rgba(24, 21, 33, 0.52)',

  tooltip: {
    bg: surface.inverse,
    fg: colors.mono[50],
    border: surface.inverse,
  },

  popover: {
    bg: surface.elevated,
    border: border.muted,
  },

  modal: {
    bg: surface.elevated,
    border: border.muted,
  },
} as const;
