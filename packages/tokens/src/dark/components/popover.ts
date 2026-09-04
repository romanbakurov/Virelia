import { createPopoverTokensFromTheme } from '../../factories/createPopoverTokens.js';
import { radius } from '../../tokens/radius.js';
import { shadows } from '../../tokens/shadows.js';
import { spacing } from '../../tokens/spacing.js';
import { overlay } from '../semantic/overlay.js';
import { shadow } from '../semantic/shadow.js';
import { text } from '../semantic/text.js';

export const popover = createPopoverTokensFromTheme({
  overlay,
  shadow,
  shadows,
  text,
  radius,
  spacing,
});
