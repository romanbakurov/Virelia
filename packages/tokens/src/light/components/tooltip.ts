import { createTooltipTokens } from '../../factories/createTooltipTokens.js';
import { radius } from '../../tokens/radius.js';
import { spacing } from '../../tokens/spacing.js';
import { typography } from '../../tokens/typography.js';
import { overlay } from '../semantic/overlay.js';
import { shadow } from '../semantic/shadow.js';

export const tooltip = createTooltipTokens({
  contentBg: overlay.tooltip.bg,
  contentFg: overlay.tooltip.fg,
  contentBorder: overlay.tooltip.border,
  contentShadow: shadow.md,
  contentRadius: radius.sm,
  contentPaddingX: spacing[3],
  contentPaddingY: spacing[2],
  contentCompactPaddingX: spacing[2],
  contentCompactPaddingY: spacing[1],
  contentFontSize: typography.size.sm,
  contentLineHeight: typography.lineHeight.sm,
  contentCompactFontSize: typography.size.xs,
  contentCompactLineHeight: typography.lineHeight.xs,
});
