import { createSwitchTokens } from '../../factories/createSwitchTokens.js';
import { colors } from '../../primitives/colors.js';
import { control } from '../semantic/control.js';
import { focus } from '../semantic/focus.js';
import { status } from '../semantic/status.js';

export const switchTokens = createSwitchTokens({
  off: {
    trackBg: control.default.bg,
    trackBorder: control.default.border,
    thumbBg: control.default.fg,
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
    trackBg: control.disabled.bg,
    trackBorder: control.disabled.border,
    thumbBg: control.disabled.fg,
  },
});
