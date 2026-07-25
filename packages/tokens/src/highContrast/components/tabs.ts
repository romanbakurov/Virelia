import {
  createTabsPalette,
  createTabsTokens,
} from '../../factories/createTabsTokens.js';
import { colors } from '../../primitives/colors.js';
import { withAlpha } from '../../utils/color.js';
import { border } from '../semantic/border.js';
import { focus } from '../semantic/focus.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

const defaults = {
  triggerDefaultFg: text.secondary,
  triggerHoverFg: text.primary,
  triggerHoverBg: withAlpha(colors.mono[50], 0.08),
  triggerActiveBg: 'transparent',
  segmentedBg: surface.hover,
  focusRing: focus.ring.color,
};

export const tabs = createTabsTokens({
  primary: createTabsPalette({
    ...defaults,
    triggerActiveFg: colors.warning[300],
    triggerActiveBorder: colors.warning[300],
    indicator: colors.warning[300],
    indicatorHover: colors.warning[200],
    segmentedActiveBg: colors.gray[900],
    segmentedActiveBorder: 'transparent',
    segmentedActiveFg: colors.warning[200],
    pillHoverBg: colors.warning[950],
    pillActiveBg: colors.gray[900],
    pillActiveBorder: colors.warning[300],
    pillActiveFg: colors.warning[200],
  }),
  neutral: createTabsPalette({
    ...defaults,
    triggerActiveFg: colors.mono[50],
    triggerActiveBorder: colors.mono[50],
    indicator: colors.mono[50],
    indicatorHover: colors.gray[200],
    segmentedActiveBg: colors.gray[900],
    segmentedActiveBorder: 'transparent',
    segmentedActiveFg: colors.mono[50],
    pillHoverBg: colors.mono[900],
    pillActiveBg: colors.gray[900],
    pillActiveBorder: colors.mono[50],
    pillActiveFg: colors.mono[50],
  }),
  success: createTabsPalette({
    ...defaults,
    triggerActiveFg: colors.success[300],
    triggerActiveBorder: colors.success[300],
    indicator: colors.success[300],
    indicatorHover: colors.success[200],
    segmentedActiveBg: colors.gray[900],
    segmentedActiveBorder: 'transparent',
    segmentedActiveFg: colors.success[200],
    pillHoverBg: colors.success[950],
    pillActiveBg: colors.gray[900],
    pillActiveBorder: colors.success[300],
    pillActiveFg: colors.success[200],
  }),
  warning: createTabsPalette({
    ...defaults,
    triggerActiveFg: colors.warning[300],
    triggerActiveBorder: colors.warning[300],
    indicator: colors.warning[300],
    indicatorHover: colors.warning[200],
    segmentedActiveBg: colors.gray[900],
    segmentedActiveBorder: 'transparent',
    segmentedActiveFg: colors.warning[200],
    pillHoverBg: colors.warning[950],
    pillActiveBg: colors.gray[900],
    pillActiveBorder: colors.warning[300],
    pillActiveFg: colors.warning[200],
  }),
  danger: createTabsPalette({
    ...defaults,
    triggerActiveFg: colors.error[300],
    triggerActiveBorder: colors.error[300],
    indicator: colors.error[300],
    indicatorHover: colors.error[200],
    segmentedActiveBg: colors.gray[900],
    segmentedActiveBorder: 'transparent',
    segmentedActiveFg: colors.error[200],
    pillHoverBg: colors.error[950],
    pillActiveBg: colors.gray[900],
    pillActiveBorder: colors.error[300],
    pillActiveFg: colors.error[200],
  }),
  disabled: {
    bg: 'transparent',
    fg: text.disabled,
    border: 'transparent',
  },
  list: {
    border: border.default,
    segmentedBg: surface.hover,
  },
  panel: {
    fg: text.primary,
  },
});
