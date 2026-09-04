import { createAccordionTokens } from '../../factories/createAccordionTokens.js';
import { border } from '../semantic/border.js';
import { focus } from '../semantic/focus.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const accordionTokens = createAccordionTokens({
  root: {
    bg: surface.default,
    border: border.muted,
  },
  divider: border.muted,
  trigger: {
    default: {
      bg: surface.default,
      fg: text.primary,
    },
    hover: {
      bg: surface.hover,
      fg: text.primary,
    },
    pressed: {
      bg: surface.pressed,
      fg: text.primary,
    },
    disabled: {
      bg: surface.disabled,
      fg: text.disabled,
    },
  },
  indicator: text.secondary,
  content: {
    bg: surface.subtle,
    fg: text.secondary,
  },
  focusRing: focus.ring.color,
});
