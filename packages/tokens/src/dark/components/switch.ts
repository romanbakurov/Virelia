import { createSwitchTokens } from '../../factories/createSwitchTokens.js';
import { colors } from '../../primitives/colors.js';
import { border } from '../semantic/border.js';
import { focus } from '../semantic/focus.js';
import { status } from '../semantic/status.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const switchTokens = createSwitchTokens({
  off: {
    trackBg: surface.elevated,
    trackBorder: border.default,
    thumbBg: text.primary,
  },
  on: {
    default: {
      trackBg: colors.primary[600],
      trackBorder: colors.primary[600],
      thumbBg: colors.primary[50],
    },
    hover: {
      trackBg: colors.primary[700],
      trackBorder: colors.primary[700],
      thumbBg: colors.primary[200],
    },
    pressed: {
      trackBg: colors.primary[800],
      trackBorder: colors.primary[800],
      thumbBg: colors.primary[300],
    },
  },
  focusRing: focus.ring.color,
  errorBorder: status.error.border,
  errorRing: status.error.ring,
  disabled: {
    trackBg: surface.disabled,
    trackBorder: border.disabled,
    thumbBg: text.disabled,
  },
});
