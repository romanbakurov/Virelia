import { border } from '../semantic/border.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const tooltip = {
  content: {
    bg: surface.inverse,
    fg: text.inverse,
    border: border.default,
  },

  arrow: {
    bg: surface.inverse,
  },
} as const;
