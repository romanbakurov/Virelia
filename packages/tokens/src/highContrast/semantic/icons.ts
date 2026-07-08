import { colors } from '../../primitives/colors.js';

export const icons = {
  primary: colors.mono[500],
  secondary: colors.mono[500],
  muted: colors.mono[500],
  disabled: colors.mono[400],
  subtle: colors.mono[50],

  hover: colors.primary[400],

  inverse: colors.mono[800],
  onInverse: colors.mono[950],

  brand: colors.primary[400],
} as const;
