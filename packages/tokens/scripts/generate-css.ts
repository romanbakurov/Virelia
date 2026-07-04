import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { darkTheme } from '../src/dark/theme.js';
import { highContrastTheme } from '../src/highContrast/theme.js';
import { lightTheme } from '../src/light/theme.js';
import { radius } from '../src/tokens/radius';
import { shadows } from '../src/tokens/shadows';
import { spacing } from '../src/tokens/spacing';
import { typography } from '../src/tokens/typography';
import { zIndex } from '../src/tokens/zIndex';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z])(\d+)/g, '$1-$2')
    .toLowerCase();
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function generateVariables(
  obj: Record<string, unknown>,
  prefix: string,
  options?: {
    numberUnit?: string;
  }
): string {
  let css = '';

  for (const [key, value] of Object.entries(obj)) {
    const name = prefix ? `${prefix}-${toKebabCase(key)}` : toKebabCase(key);

    if (typeof value === 'string') {
      css += `  --${name}: ${value};\n`;
      continue;
    }

    if (typeof value === 'number') {
      css += `  --${name}: ${value}${options?.numberUnit ?? ''};\n`;
      continue;
    }

    if (isPlainObject(value)) {
      css += generateVariables(value, name, options);
    }
  }

  return css;
}

type ShadowToken = {
  x: number;
  y: number;
  blur: number;
  opacity: number;
  color: string;
};

function generateShadowVariables(shadows: Record<string, ShadowToken>): string {
  let css = '';

  for (const [key, shadow] of Object.entries(shadows)) {
    const color =
      shadow.color === '#000' || shadow.color === '#000000'
        ? `rgba(0,0,0,${shadow.opacity})`
        : shadow.color;

    css += `  --shadow-${key}: ${shadow.x}px ${shadow.y}px ${shadow.blur}px ${color};\n`;
  }

  return css;
}

function generateBaseVariables(): string {
  let css = '';

  css += generateVariables(spacing, 'space', {
    numberUnit: 'px',
  });

  css += generateVariables(radius, 'radius', {
    numberUnit: 'px',
  });

  css += generateVariables(zIndex, 'z-index');

  css += generateVariables(typography.family, 'font-family');

  css += generateVariables(typography.weight, 'font-weight');

  css += generateVariables(typography.size, 'font-size', {
    numberUnit: 'px',
  });

  css += generateVariables(typography.lineHeight, 'line-height', {
    numberUnit: 'px',
  });

  css += generateShadowVariables(shadows);

  return css;
}

function generateThemeBlock(
  selector: string,
  theme: typeof lightTheme
): string {
  return `${selector} {\n${generateVariables(theme.colors, 'color')}${generateVariables(
    theme.semantic,
    ''
  )}${generateVariables(theme.components, '')}}\n`;
}

let css = `/**
 * AUTO-GENERATED FILE
 * DO NOT EDIT MANUALLY
 * Generated: ${new Date().toISOString()}
 */

:root {
${generateBaseVariables()}}
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

const outputPath = path.resolve(__dirname, '../dist/css/tokens.css');

fs.mkdirSync(path.dirname(outputPath), {
  recursive: true,
});

fs.writeFileSync(outputPath, css, 'utf8');

console.log('✅ tokens.css generated');
console.log(outputPath);
