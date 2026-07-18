import { createInputColorPalette } from '../../factories/createInputPalette.js';
import { createSelectPalette } from '../../factories/createSelectPalette.js';
import { colors } from '../../primitives/colors.js';
import { border } from '../semantic/border.js';
import { control } from '../semantic/control.js';
import { focus } from '../semantic/focus.js';
import { icons } from '../semantic/icons.js';
import { menu } from '../semantic/menu.js';
import { status } from '../semantic/status.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

const selectPaletteDefaults = {
  fg: text.primary,
  placeholder: text.secondary,
  filledFocusBg: surface.subtle,
  hoverBg: surface.hover,
};

const primary = createInputColorPalette({
  ...selectPaletteDefaults,
  accent: colors.primary[400],
  accentHover: colors.primary[500],
  accentSoft: colors.primary[900],
  filledBg: colors.primary[950],
  filledHoverBg: colors.primary[900],
  ring: colors.primary[400],
});

const neutral = createInputColorPalette({
  ...selectPaletteDefaults,
  accent: colors.vellira[300],
  accentHover: colors.vellira[400],
  accentSoft: colors.vellira[800],
  filledBg: colors.vellira[900],
  filledHoverBg: colors.vellira[800],
  hoverBg: colors.vellira[900],
  ring: colors.vellira[400],
});

const success = createInputColorPalette({
  ...selectPaletteDefaults,
  accent: colors.success[400],
  accentHover: colors.success[500],
  accentSoft: colors.success[900],
  filledBg: colors.success[950],
  filledHoverBg: colors.success[900],
  hoverBg: colors.success[950],
  ring: colors.success[500],
});

const warning = createInputColorPalette({
  ...selectPaletteDefaults,
  accent: colors.warning[400],
  accentHover: colors.warning[500],
  accentSoft: colors.warning[900],
  filledBg: colors.warning[950],
  filledHoverBg: colors.warning[900],
  hoverBg: colors.warning[950],
  ring: colors.warning[500],
});

const danger = createInputColorPalette({
  ...selectPaletteDefaults,
  accent: colors.error[400],
  accentHover: colors.error[500],
  accentSoft: colors.error[900],
  filledBg: colors.error[950],
  filledHoverBg: colors.error[900],
  hoverBg: colors.error[950],
  ring: colors.error[500],
});

export const select = {
  primary: createSelectPalette(primary, {
    dropdownBorder: 'transparent',
    optionActiveBorder: 'transparent',
    optionActiveRing: 'transparent',
    optionHoverBorder: 'transparent',
    optionPressedBg: colors.primary[700],
    optionPressedBorder: 'transparent',
    optionSelectedBg: colors.primary[800],
  }),
  neutral: createSelectPalette(neutral, {
    dropdownBorder: 'transparent',
    optionActiveBorder: 'transparent',
    optionActiveRing: 'transparent',
    optionHoverBorder: 'transparent',
    optionPressedBg: colors.vellira[800],
    optionPressedBorder: 'transparent',
    optionSelectedBg: colors.vellira[850],
  }),
  success: createSelectPalette(success, {
    dropdownBorder: 'transparent',
    optionActiveBorder: 'transparent',
    optionActiveRing: 'transparent',
    optionHoverBorder: 'transparent',
    optionPressedBg: colors.success[800],
    optionPressedBorder: 'transparent',
    optionSelectedBg: colors.success[900],
  }),
  warning: createSelectPalette(warning, {
    dropdownBorder: 'transparent',
    optionActiveBorder: 'transparent',
    optionActiveRing: 'transparent',
    optionHoverBorder: 'transparent',
    optionPressedBg: colors.warning[800],
    optionPressedBorder: 'transparent',
    optionSelectedBg: colors.warning[900],
  }),
  danger: createSelectPalette(danger, {
    dropdownBorder: 'transparent',
    optionActiveBorder: 'transparent',
    optionActiveRing: 'transparent',
    optionHoverBorder: 'transparent',
    optionPressedBg: colors.error[800],
    optionPressedBorder: 'transparent',
    optionSelectedBg: colors.error[900],
  }),

  trigger: {
    default: {
      bg: 'transparent',
      fg: text.primary,
      border: border.default,
      icon: icons.brand,
      placeholder: text.secondary,
    },

    hover: {
      ...control.hover,
      icon: icons.hover,
      placeholder: text.secondary,
    },

    focus: {
      bg: 'transparent',
      fg: text.primary,
      border: border.focus,
      ring: focus.ring.color,
      icon: icons.brand,
      placeholder: text.secondary,
    },

    disabled: {
      ...control.disabled,
      icon: icons.disabled,
      placeholder: text.disabled,
    },

    placeholder: {
      fg: text.secondary,
    },

    error: {
      border: status.error.border,
      ring: status.error.ring,
    },
  },

  dropdown: {
    bg: menu.background,
    fg: menu.item.default.fg,
    border: 'transparent',
    shadow: 'none',

    search: {
      bg: surface.default,
      fg: text.primary,
      border: border.muted,
      placeholder: text.secondary,
      ring: focus.ring.color,
    },

    empty: {
      fg: text.secondary,
    },

    groupLabel: {
      fg: text.secondary,
    },

    separator: {
      bg: border.muted,
    },
  },

  option: {
    default: {
      bg: menu.item.default.bg,
      fg: menu.item.default.fg,
      border: 'transparent',
    },

    hover: {
      bg: menu.item.hover.bg,
      fg: menu.item.hover.fg,
      border: 'transparent',
    },

    active: {
      bg: menu.item.active.bg,
      fg: menu.item.active.fg,
      border: 'transparent',
      ring: 'transparent',
    },

    pressed: {
      bg: menu.item.pressed.bg,
      fg: menu.item.pressed.fg,
      border: 'transparent',
    },

    selected: {
      bg: control.selected.muted.bg,
      fg: control.selected.muted.fg,
      border: control.selected.muted.border,
      shadow: 'none',
    },

    disabled: {
      bg: menu.item.disabled.bg,
      fg: menu.item.disabled.fg,
      border: 'transparent',
    },

    description: {
      fg: text.secondary,
    },

    icon: {
      fg: icons.default,
    },

    badge: {
      bg: surface.subtle,
      fg: text.secondary,
      border: border.muted,
    },

    shortcut: {
      bg: surface.subtle,
      fg: text.secondary,
      border: border.muted,
    },

    success: {
      fg: status.success.fg,
    },

    warning: {
      fg: status.warning.fg,
    },

    danger: {
      fg: status.error.fg,
    },
  },
} as const;
