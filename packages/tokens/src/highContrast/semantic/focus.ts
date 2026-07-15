import { colors } from '../../primitives/colors.js';

export const focus = {
  ring: {
    color: colors.warning[300],
    width: '2px',
    shadow: '0 0 0 1px rgba(255, 255, 255, 0.28)',
    offset: colors.mono[950],
  },
} as const;
