export const controlSizes = {
  sm: {
    height: 38,
    fontSize: 12,
    lineHeight: 16,
    iconSize: 16,
  },
  md: {
    height: 46,
    fontSize: 14,
    lineHeight: 20,
    iconSize: 20,
  },
  lg: {
    height: 52,
    fontSize: 16,
    lineHeight: 24,
    iconSize: 24,
  },
} as const;

export type ControlSize = keyof typeof controlSizes;
