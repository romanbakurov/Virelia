import { overlay } from '../semantic/overlay.js';
import { shadow } from '../semantic/shadow.js';

export const tooltip = {
  content: {
    bg: overlay.tooltip.bg,
    fg: overlay.tooltip.fg,
    border: overlay.tooltip.border,
    shadow: shadow.md,
  },

  arrow: {
    bg: overlay.tooltip.bg,
  },
} as const;
