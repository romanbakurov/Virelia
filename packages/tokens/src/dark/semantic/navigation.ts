import { colors } from '../../primitives/colors.js';

import { surface } from './surface.js';
import { text } from './text.js';

export const navigation = {
  hover: {
    bg: surface.active,
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
    bg: surface.active,
    fg: text.primary,
  },
  optionActive: {
    bg: surface.active,
    fg: text.primary,
  },
  border: colors.vellira[700],
  triggerHover: {
    bg: surface.hover,
    fg: colors.vellira[50],
  },
} as const;
