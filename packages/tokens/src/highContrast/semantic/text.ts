import { colors } from '../../primitives/colors.js';

const inverse = colors.mono[950];

export const text = {
  primary: colors.mono[50],
  secondary: colors.vellira[150],
  muted: colors.gray[200],
  disabled: colors.gray[500],
  subtle: colors.gray[100],

  inverse,
  onInverse: inverse,

  brand: colors.primary[300],
} as const;
