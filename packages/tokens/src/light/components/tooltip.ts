import { createTooltipTokensFromTheme } from '../../factories/createTooltipTokens.js';
import { radius } from '../../tokens/radius.js';
import { spacing } from '../../tokens/spacing.js';
import { typography } from '../../tokens/typography.js';
import { overlay } from '../semantic/overlay.js';
import { shadow } from '../semantic/shadow.js';

export const tooltip = createTooltipTokensFromTheme({
  overlay,
  shadow,
  radius,
  spacing,
  typography,
});
