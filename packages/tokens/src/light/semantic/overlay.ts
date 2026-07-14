import { colors } from '../../primitives/colors.js';

import { border } from './border.js';
import { surface } from './surface.js';

export const overlay = {
  backdrop: 'rgba(0,0,0,.72)',

  tooltip: {
    bg: colors.mono[50],
    fg: colors.mono[950],
    border: border.subtle,
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
