import { colors } from '../../primitives/colors.js';

import { text } from './text.js';

export const navigation = {
  hover: {
    bg: colors.vellira[100],
    fg: text.primary,
  },
  active: {
    bg: colors.vellira[150],
    fg: text.primary,
  },
  brandHover: {
    bg: colors.vellira[100],
    fg: colors.primary[900],
  },
  tabHover: {
    fg: colors.primary[500],
  },
  tabFocus: {
    ring: colors.warning[500],
  },
  optionHover: {
    bg: colors.gray[300],
    fg: text.primary,
  },
  optionActive: {
    bg: colors.gray[200],
    fg: text.primary,
  },
  border: colors.vellira[200],
} as const;
