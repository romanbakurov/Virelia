import { colors } from '../../primitives/colors.js';

import { surface } from './surface.js';
import { text } from './text.js';

export const navigation = {
  hover: {
    bg: colors.warning[500],
    fg: colors.mono[950],
  },
  active: {
    bg: colors.warning[500],
    fg: colors.mono[950],
  },
  brandHover: {
    bg: colors.warning[500],
    fg: colors.mono[950],
  },
  tabHover: {
    fg: colors.warning[500],
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
  disabled: {
    bg: colors.gray[900],
    fg: colors.gray[600],
  },
  groupLabel: {
    fg: colors.gray[400],
  },
  itemHover: {
    bg: surface.hover,
    fg: text.primary,
  },
  itemActive: {
    bg: surface.hover,
    fg: text.primary,
  },
  border: colors.gray[200],
} as const;
