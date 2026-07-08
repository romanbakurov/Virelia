// packages/tokens/src/utils/color.ts

export const withAlpha = (hex: string, alpha: number): string => {
  const normalized = hex.replace('#', '');

  if (normalized.length !== 6) {
    throw new Error(
      `withAlpha() expects a 6-digit hex color. Received: ${hex}`
    );
  }

  const opacity = Math.round(Math.min(Math.max(alpha, 0), 1) * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();

  return `#${normalized}${opacity}`;
};
