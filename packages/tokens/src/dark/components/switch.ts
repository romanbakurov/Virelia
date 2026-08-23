import { createSwitchTokens } from '../../factories/createSwitchTokens.js';
import { control } from '../semantic/control.js';
import { focus } from '../semantic/focus.js';
import { status } from '../semantic/status.js';

export const switchTokens = createSwitchTokens({
  geometry: {
    trackWidth: 44,
    trackHeight: 24,
    borderWidth: 2,
    padding: 1,
    thumbSize: 18,
    thumbTravel: 20,
    focusRingWidth: 2,
    focusRingOffset: 2,
    pressScale: 0.98,
  },
  off: {
    trackBg: control.default.bg,
    trackBorder: control.default.border,
    thumbBg: control.default.fg,
  },
  on: {
    default: {
      trackBg: control.selected.default.bg,
      trackBorder: control.selected.default.border,
      thumbBg: control.selected.default.fg,
    },
    hover: {
      trackBg: control.selected.hover.bg,
      trackBorder: control.selected.hover.border,
      thumbBg: control.selected.hover.fg,
    },
    pressed: {
      trackBg: control.selected.active.bg,
      trackBorder: control.selected.active.border,
      thumbBg: control.selected.active.fg,
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
