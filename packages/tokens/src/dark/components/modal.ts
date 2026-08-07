import { createModalTokens } from '../../factories/createModalTokens.js';
import { radius } from '../../tokens/radius.js';
import { spacing } from '../../tokens/spacing.js';
import { focus } from '../semantic/focus.js';
import { overlay } from '../semantic/overlay.js';
import { shadow } from '../semantic/shadow.js';
import { surface } from '../semantic/surface.js';
import { text } from '../semantic/text.js';

export const modal = createModalTokens({
  overlayBg: overlay.backdrop,
  contentBg: overlay.modal.bg,
  contentFg: text.primary,
  contentBorder: overlay.modal.border,
  contentShadow: shadow.xl,
  titleFg: text.primary,
  descriptionFg: text.secondary,
  closeButtonDefaultFg: text.secondary,
  closeButtonHoverBg: surface.elevated,
  closeButtonHoverFg: text.primary,
  closeButtonPressedBg: surface.active,
  closeButtonPressedFg: text.primary,
  closeButtonDisabledFg: text.disabled,
  closeButtonFocusRing: focus.ring,
  radiusLg: radius.lg,
  radiusFull: radius.full,
  spacing1: spacing[1],
  spacing3: spacing[3],
  spacing4: spacing[4],
  spacing8: spacing[8],
  spacing10: spacing[10],
});
