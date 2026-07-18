import { createInputColorPalette } from '../../factories/createInputPalette.js';
import { createSelectPalette } from '../../factories/createSelectPalette.js';
import { colors } from '../../primitives/colors.js';
import { border } from '../semantic/border.js';
import { control } from '../semantic/control.js';
import { focus } from '../semantic/focus.js';
import { icons } from '../semantic/icons.js';
import { menu } from '../semantic/menu.js';
import { shadow } from '../semantic/shadow.js';
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
  accent: colors.primary[500],
  accentHover: colors.primary[700],
  accentSoft: colors.primary[50],
  filledBg: colors.primary[100],
  filledHoverBg: colors.primary[200],
  ring: colors.primary[400],
});

const neutral = createInputColorPalette({
  ...selectPaletteDefaults,
  accent: colors.vellira[400],
  accentHover: colors.vellira[600],
  accentSoft: colors.vellira[100],
  filledBg: colors.vellira[150],
  filledHoverBg: colors.vellira[200],
  hoverBg: colors.vellira[100],
  ring: colors.vellira[400],
});

const success = createInputColorPalette({
  ...selectPaletteDefaults,
  accent: colors.success[600],
  accentHover: colors.success[700],
  accentSoft: colors.success[50],
  filledBg: colors.success[100],
  filledHoverBg: colors.success[200],
  hoverBg: colors.success[50],
  ring: colors.success[500],
});

const warning = createInputColorPalette({
  ...selectPaletteDefaults,
  accent: colors.warning[600],
  accentHover: colors.warning[700],
  accentSoft: colors.warning[50],
  filledBg: colors.warning[100],
  filledHoverBg: colors.warning[200],
  hoverBg: colors.warning[50],
  ring: colors.warning[500],
});

const danger = createInputColorPalette({
  ...selectPaletteDefaults,
  accent: colors.error[600],
  accentHover: colors.error[700],
  accentSoft: colors.error[50],
  filledBg: colors.error[100],
  filledHoverBg: colors.error[200],
  hoverBg: colors.error[50],
  ring: colors.error[500],
});

export const select = {
  primary: createSelectPalette(primary, {
    dropdownBorder: 'transparent',
    optionActiveBorder: 'transparent',
    optionActiveRing: 'transparent',
    optionHoverBg: colors.primary[50],
    optionHoverBorder: 'transparent',
    optionPressedBg: colors.primary[200],
    optionPressedBorder: 'transparent',
    optionSelectedBg: colors.primary[100],
  }),
  neutral: createSelectPalette(neutral, {
    dropdownBorder: 'transparent',
    optionActiveBorder: 'transparent',
    optionActiveRing: 'transparent',
    optionHoverBorder: 'transparent',
    optionPressedBg: colors.vellira[200],
    optionPressedBorder: 'transparent',
    optionSelectedBg: colors.vellira[150],
  }),
  success: createSelectPalette(success, {
    dropdownBorder: 'transparent',
    optionActiveBorder: 'transparent',
    optionActiveRing: 'transparent',
    optionHoverBorder: 'transparent',
    optionPressedBg: colors.success[200],
    optionPressedBorder: 'transparent',
    optionSelectedBg: colors.success[100],
  }),
  warning: createSelectPalette(warning, {
    dropdownBorder: 'transparent',
    optionActiveBorder: 'transparent',
    optionActiveRing: 'transparent',
    optionHoverBorder: 'transparent',
    optionPressedBg: colors.warning[200],
    optionPressedBorder: 'transparent',
    optionSelectedBg: colors.warning[100],
  }),
  danger: createSelectPalette(danger, {
    dropdownBorder: 'transparent',
    optionActiveBorder: 'transparent',
    optionActiveRing: 'transparent',
    optionHoverBorder: 'transparent',
    optionPressedBg: colors.error[200],
    optionPressedBorder: 'transparent',
    optionSelectedBg: colors.error[100],
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
    shadow: shadow.lg,

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
      ...menu.item.default,
      border: 'transparent',
    },

    hover: {
      ...menu.item.hover,
      border: 'transparent',
    },

    active: {
      ...menu.item.active,
      border: 'transparent',
      ring: 'transparent',
    },

    pressed: {
      ...menu.item.pressed,
      border: 'transparent',
    },

    selected: {
      bg: control.selected.muted.bg,
      fg: control.selected.muted.fg,
      border: control.selected.muted.border,
      shadow: shadow.inset,
    },

    disabled: {
      ...menu.item.disabled,
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
