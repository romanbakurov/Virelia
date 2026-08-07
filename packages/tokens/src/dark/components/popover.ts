import { createPopoverTokens } from '../../factories/createPopoverTokens.js';
import { radius } from '../../tokens/radius.js';
import { shadows } from '../../tokens/shadows.js';
import { spacing } from '../../tokens/spacing.js';
import { overlay } from '../semantic/overlay.js';
import { shadow } from '../semantic/shadow.js';
import { text } from '../semantic/text.js';

export const popover = createPopoverTokens({
  contentBg: overlay.popover.bg,
  contentFg: text.primary,
  contentBorder: overlay.popover.border,
  contentWebShadow: shadow.lg,
  contentNativeShadow: shadows.lg,
  titleFg: text.primary,
  descriptionFg: text.secondary,
  radiusLg: radius.lg,
  spacing3: spacing[3],
  spacing4: spacing[4],
});
