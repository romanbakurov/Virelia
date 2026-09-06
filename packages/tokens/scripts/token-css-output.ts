import { darkTheme } from '../src/dark/theme.js';
import { highContrastTheme } from '../src/highContrast/theme.js';
import { lightTheme } from '../src/light/theme.js';
import { radius } from '../src/tokens/radius';
import { shadows } from '../src/tokens/shadows';
import { spacing } from '../src/tokens/spacing';
import { typography } from '../src/tokens/typography';
import { zIndex } from '../src/tokens/zIndex';

type Theme = typeof lightTheme | typeof darkTheme | typeof highContrastTheme;

type CssOutputEntry = {
  variable: string;
  value: string;
};

type VariableOptions = {
  numberUnit?: string;
  unitlessNumberKeys?: readonly string[];
};

type ShadowToken = {
  x: number;
  y: number;
  blur: number;
  opacity: number;
  color: string;
};

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z])(\d+)/g, '$1-$2')
    .toLowerCase();
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function collectVariables(
  obj: Record<string, unknown>,
  cssPrefix: string,
  tokenPrefix: string,
  output: Map<string, CssOutputEntry>,
  options?: VariableOptions
): void {
  for (const [key, value] of Object.entries(obj)) {
    const cssName = cssPrefix
      ? `${cssPrefix}-${toKebabCase(key)}`
      : toKebabCase(key);
    const tokenPath = tokenPrefix ? `${tokenPrefix}.${key}` : key;

    if (typeof value === 'string') {
      output.set(tokenPath, {
        variable: `--${cssName}`,
        value,
      });
      continue;
    }

    if (typeof value === 'number') {
      const numberUnit = options?.unitlessNumberKeys?.includes(key)
        ? ''
        : (options?.numberUnit ?? '');

      output.set(tokenPath, {
        variable: `--${cssName}`,
        value: `${value}${numberUnit}`,
      });
      continue;
    }

    if (isPlainObject(value)) {
      collectVariables(value, cssName, tokenPath, output, options);
    }
  }
}

function collectShadowVariables(
  source: Record<string, ShadowToken>,
  output: Map<string, CssOutputEntry>
): void {
  for (const [key, shadow] of Object.entries(source)) {
    const color =
      shadow.color === '#000' || shadow.color === '#000000'
        ? `rgba(0,0,0,${shadow.opacity})`
        : shadow.color;

    output.set(`tokens.shadows.${key}`, {
      variable: `--shadow-${key}`,
      value: `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${color}`,
    });
  }
}

export function collectBaseCssOutput(): Map<string, CssOutputEntry> {
  const output = new Map<string, CssOutputEntry>();

  collectVariables(spacing, 'space', 'tokens.spacing', output, {
    numberUnit: 'px',
  });
  collectVariables(radius, 'radius', 'tokens.radius', output, {
    numberUnit: 'px',
  });
  collectVariables(zIndex, 'z-index', 'tokens.zIndex', output);
  collectVariables(
    typography.family,
    'font-family',
    'tokens.typography.family',
    output
  );
  collectVariables(
    typography.weight,
    'font-weight',
    'tokens.typography.weight',
    output
  );
  collectVariables(
    typography.size,
    'font-size',
    'tokens.typography.size',
    output,
    { numberUnit: 'px' }
  );
  collectVariables(
    typography.lineHeight,
    'line-height',
    'tokens.typography.lineHeight',
    output,
    { numberUnit: 'px' }
  );
  collectShadowVariables(shadows, output);

  return output;
}

export function collectThemeCssOutput(
  theme: Theme
): Map<string, CssOutputEntry> {
  const output = new Map<string, CssOutputEntry>();

  collectVariables(theme.colors, 'color', 'colors', output);
  collectVariables(theme.semantic, '', 'semantic', output);
  collectVariables(theme.components, '', 'components', output, {
    numberUnit: 'px',
    unitlessNumberKeys: ['pressScale'],
  });

  return output;
}

export function collectResolvedWebCssOutput(theme: Theme): Map<string, string> {
  return new Map(
    [...collectBaseCssOutput(), ...collectThemeCssOutput(theme)].map(
      ([path, entry]) => [path, JSON.stringify([entry.variable, entry.value])]
    )
  );
}

function renderVariables(output: Map<string, CssOutputEntry>): string {
  let css = '';

  for (const { variable, value } of output.values()) {
    css += `  ${variable}: ${value};\n`;
  }

  return css;
}

function generateThemeBlock(selector: string, theme: Theme): string {
  return `${selector} {\n${renderVariables(collectThemeCssOutput(theme))}}\n`;
}

export function generateTokenCss(): string {
  let css = `/**
 * AUTO-GENERATED FILE
 * DO NOT EDIT MANUALLY
 */

:root {
${renderVariables(collectBaseCssOutput())}}
`;

  css += '\n';
  css += generateThemeBlock(
    `:root,\n[data-theme='light'],\n[data-vellira-theme='light']`,
    lightTheme
  );
  css += '\n';
  css += generateThemeBlock(
    `[data-theme='dark'],\n[data-vellira-theme='dark']`,
    darkTheme
  );
  css += '\n';
  css += generateThemeBlock(
    `[data-theme='high-contrast'],\n[data-vellira-theme='high-contrast']`,
    highContrastTheme
  );

  return css;
}
