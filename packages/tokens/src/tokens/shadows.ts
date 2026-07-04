import { colors } from '../primitives/colors.js';

export const shadows = {
  sm: {
    x: 0,
    y: 1,
    blur: 3,
    color: colors.mono[950],
    opacity: 0.04,
    elevation: 1,
  },

  md: {
    x: 0,
    y: 6,
    blur: 16,
    color: colors.mono[950],
    opacity: 0.08,
    elevation: 4,
  },

  lg: {
    x: 0,
    y: 12,
    blur: 32,
    color: colors.mono[950],
    opacity: 0.1,
    elevation: 8,
  },
} as const;
