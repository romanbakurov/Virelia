import {
  createTabsPalette,
  createTabsTokens,
} from '../../factories/createTabsTokens.js';
import { colors } from '../../primitives/colors.js';
import { border } from '../semantic/border.js';
import { focus } from '../semantic/focus.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

const defaults = {
  triggerDefaultFg: text.secondary,
  triggerHoverFg: text.primary,
  triggerHoverBg: surface.hover,
  triggerActiveBg: 'transparent',
  segmentedBg: surface.hover,
  focusRing: focus.ring.color,
};

export const tabs = createTabsTokens({
  primary: createTabsPalette({
    ...defaults,
    triggerActiveFg: colors.primary[300],
    triggerActiveBorder: colors.primary[500],
    indicator: colors.primary[500],
    indicatorHover: colors.primary[400],
    segmentedActiveBg: colors.primary[900],
    segmentedActiveBorder: colors.primary[700],
    segmentedActiveFg: colors.primary[100],
    pillHoverBg: colors.primary[950],
    pillActiveBg: colors.primary[900],
    pillActiveBorder: colors.primary[700],
    pillActiveFg: colors.primary[100],
  }),
  neutral: createTabsPalette({
    ...defaults,
    triggerActiveFg: colors.vellira[100],
    triggerActiveBorder: colors.vellira[300],
    indicator: colors.vellira[300],
    indicatorHover: colors.vellira[200],
    segmentedActiveBg: colors.vellira[800],
    segmentedActiveBorder: colors.vellira[600],
    segmentedActiveFg: colors.vellira[100],
    pillHoverBg: colors.vellira[850],
    pillActiveBg: colors.vellira[800],
    pillActiveBorder: colors.vellira[600],
    pillActiveFg: colors.vellira[100],
  }),
  success: createTabsPalette({
    ...defaults,
    triggerActiveFg: colors.success[300],
    triggerActiveBorder: colors.success[500],
    indicator: colors.success[500],
    indicatorHover: colors.success[400],
    segmentedActiveBg: colors.success[950],
    segmentedActiveBorder: colors.success[700],
    segmentedActiveFg: colors.success[100],
    pillHoverBg: colors.success[950],
    pillActiveBg: colors.success[900],
    pillActiveBorder: colors.success[700],
    pillActiveFg: colors.success[100],
  }),
  warning: createTabsPalette({
    ...defaults,
    triggerActiveFg: colors.warning[300],
    triggerActiveBorder: colors.warning[500],
    indicator: colors.warning[500],
    indicatorHover: colors.warning[400],
    segmentedActiveBg: colors.warning[950],
    segmentedActiveBorder: colors.warning[700],
    segmentedActiveFg: colors.warning[100],
    pillHoverBg: colors.warning[950],
    pillActiveBg: colors.warning[900],
    pillActiveBorder: colors.warning[700],
    pillActiveFg: colors.warning[100],
  }),
  danger: createTabsPalette({
    ...defaults,
    triggerActiveFg: colors.error[300],
    triggerActiveBorder: colors.error[500],
    indicator: colors.error[500],
    indicatorHover: colors.error[400],
    segmentedActiveBg: colors.error[950],
    segmentedActiveBorder: colors.error[700],
    segmentedActiveFg: colors.error[100],
    pillHoverBg: colors.error[950],
    pillActiveBg: colors.error[900],
    pillActiveBorder: colors.error[700],
    pillActiveFg: colors.error[100],
  }),
  disabled: {
    bg: 'transparent',
    fg: text.disabled,
    border: 'transparent',
  },
  list: {
    border: border.muted,
    segmentedBg: surface.hover,
  },
  panel: {
    fg: text.primary,
  },
});
