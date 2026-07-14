import { colors } from '../../primitives/colors.js';

import { border } from './border.js';
import { surface } from './surface.js';

export const overlay = {
  backdrop: 'rgba(0, 0, 0, 0.82)',

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
