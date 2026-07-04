import { darkTheme } from './dark/theme.js';
import { highContrastTheme } from './highContrast/theme.js';
import { lightTheme } from './light/theme.js';

export { darkTheme, highContrastTheme, lightTheme };

export type {
  BaseCssVariableName,
  BaseTokenPath,
  ColorTokenPath,
  ComponentTokenPath,
  CssVariableName,
  DarkTheme,
  HighContrastTheme,
  LightTheme,
  SemanticTokenPath,
  ThemeCssVariableName,
  ThemeName,
  TokenPath,
  VelliraBaseTokens,
  VelliraColors,
  VelliraComponentTokens,
  VelliraSemanticTokens,
  VelliraTheme,
  WidenTokenValues,
} from './generated/token-types.js';
export {
  baseCssVariableNames,
  baseTokenPaths,
  colorTokenPaths,
  componentTokenPaths,
  cssVariableNames,
  semanticTokenPaths,
  themeCssVariableNames,
  themeNames,
  tokenPaths,
} from './generated/token-types.js';
export { overlay } from './semantic/overlay.js';

export const theme = {
  semantic: darkTheme.semantic,
  components: darkTheme.components,
  tokens: darkTheme.tokens,
} as const;
