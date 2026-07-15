import { colors } from '../../primitives/colors.js';

import { border } from './border.js';
import { surface } from './surface.js';
import { text } from './text.js';

export const navigation = {
  hover: {
    bg: surface.hover,
    fg: text.primary,
  },
  active: {
    bg: surface.active,
    fg: text.primary,
  },
  brandHover: {
    bg: surface.hover,
    fg: colors.primary[200],
  },
  tabHover: {
    fg: colors.primary[200],
  },
  tabFocus: {
    ring: colors.warning[500],
  },
  optionHover: {
    bg: surface.hover,
    fg: text.primary,
  },
  optionActive: {
    bg: surface.active,
    fg: text.primary,
  },
  triggerHover: {
    bg: surface.hover,
    fg: text.primary,
  },

  border: border.muted,
} as const;
