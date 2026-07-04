import { colors } from '../primitives/colors.js';
import {
  radius,
  shadows,
  spacing,
  typography,
  zIndex,
} from '../tokens/index.js';

import * as components from './components/index.js';
import * as semantic from './semantic/index.js';

export const highContrastTheme = {
  name: 'high-contrast',
  colors,
  semantic,
  components,
  tokens: {
    radius,
    shadows,
    spacing,
    typography,
    zIndex,
  },
} as const;
