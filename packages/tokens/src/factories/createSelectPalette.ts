import type { createInputColorPalette } from './createInputPalette.js';

type SelectBasePalette = ReturnType<typeof createInputColorPalette>;
type SelectVariantName = 'outline' | 'filled' | 'soft';

const createSelectVariant = (
  palette: SelectBasePalette,
  variant: SelectVariantName
) => ({
  ...palette[variant],
  dropdown: {
    border: palette.outline.default.border,
    ring: palette.ring,
  },
  option: {
    active: {
      bg: palette[variant].hover.bg,
      fg: palette[variant].hover.fg,
      border: palette[variant].hover.border,
      ring: palette.ring,
    },
    selected: {
      bg: palette.soft.default.bg,
      fg: palette.soft.default.fg,
      border: palette.outline.default.border,
    },
    badge: {
      bg: palette.soft.default.bg,
      fg: palette.soft.default.fg,
      border: palette.soft.default.border,
    },
  },
});

export const createSelectPalette = (palette: SelectBasePalette) =>
  ({
    ring: palette.ring,
    outline: createSelectVariant(palette, 'outline'),
    filled: createSelectVariant(palette, 'filled'),
    soft: createSelectVariant(palette, 'soft'),
  }) as const;
