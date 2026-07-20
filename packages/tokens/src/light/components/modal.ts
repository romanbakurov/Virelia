import { radius } from '../../tokens/radius.js';
import { spacing } from '../../tokens/spacing.js';
import { focus } from '../semantic/focus.js';
import { overlay } from '../semantic/overlay.js';
import { shadow } from '../semantic/shadow.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

const modalLayout = {
  viewportMargin: spacing[8],
  topOffset: spacing[10],
  maxHeight: '90vh',
  nativeMaxHeight: '90%',
  zIndexOffset: '1',
  animationDuration: '160ms',
} as const;

export const modal = {
  overlay: {
    bg: overlay.backdrop,
    blur: 4,
    animationDuration: '200ms',
  },

  content: {
    bg: overlay.modal.bg,
    fg: text.primary,
    border: overlay.modal.border,
    shadow: shadow.xl,
    borderWidth: 1,
    radius: radius.lg,
    padding: spacing[4],
    gap: spacing[4],
    minWidth: 320,
    maxHeight: modalLayout.maxHeight,
    nativeMaxHeight: modalLayout.nativeMaxHeight,
    viewportMargin: modalLayout.viewportMargin,
    topOffset: modalLayout.topOffset,
    zIndexOffset: modalLayout.zIndexOffset,
    animationDuration: modalLayout.animationDuration,

    size: {
      sm: 400,
      md: 560,
      lg: 720,
      xl: 960,
    },
  },

  title: {
    fg: text.primary,
  },

  description: {
    fg: text.secondary,
  },

  header: {
    gap: spacing[4],
    paddingBottom: spacing[4],
    textGap: spacing[1],
  },

  body: {
    paddingBottom: spacing[4],
  },

  footer: {
    gap: spacing[3],
    paddingTop: spacing[4],
  },

  closeButton: {
    size: 32,
    iconSize: 16,
    radius: radius.full,

    default: {
      bg: 'transparent',
      fg: text.secondary,
      border: 'transparent',
    },

    hover: {
      bg: surface.hover,
      fg: text.primary,
      border: 'transparent',
    },

    pressed: {
      bg: surface.pressed,
      fg: text.primary,
      border: 'transparent',
    },

    focus: {
      ring: focus.ring,
    },

    disabled: {
      bg: 'transparent',
      fg: text.disabled,
      border: 'transparent',
    },
  },
} as const;
