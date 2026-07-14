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
    fg: text.interactiveHover,
  },

  tabHover: {
    fg: text.interactiveHover,
  },

  tabFocus: {
    ring: colors.primary[700],
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
    fg: text.interactiveHover,
  },

  border: border.muted,
} as const;
