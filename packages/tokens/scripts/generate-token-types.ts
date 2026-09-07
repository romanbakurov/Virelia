import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { darkTheme } from '../src/dark/theme.js';
import { highContrastTheme } from '../src/highContrast/theme.js';
import { lightTheme } from '../src/light/theme.js';
import { isComponentPlatformIntent } from '../src/platform-output/component-token-intents.js';
import { componentTokenWebCompatibilityAliases } from '../src/platform-output/component-token-web-compatibility.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../src/generated/token-types.ts');
const checkMode = process.argv.includes('--check');
const naturalCollator = new Intl.Collator('en', {
  numeric: true,
  sensitivity: 'base',
});

function writeFileIfChanged(filePath: string, content: string): void {
  const current = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, 'utf8')
    : '';

  if (current !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function sortValues<T extends string>(values: T[]): T[] {
  return values.sort(naturalCollator.compare);
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z])(\d+)/g, '$1-$2')
    .toLowerCase();
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function collectTokenPaths(
  obj: Record<string, unknown>,
  prefix = ''
): string[] {
  const paths: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const name = prefix ? `${prefix}.${key}` : key;

    if (isComponentPlatformIntent(value)) {
      paths.push(name);
      continue;
    }

    if (isPlainObject(value)) {
      paths.push(...collectTokenPaths(value, name));
      continue;
    }

    paths.push(name);
  }

  return sortValues(paths);
}

function collectCssVariableNames(
  obj: Record<string, unknown>,
  prefix: string
): string[] {
  const names: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const name = prefix ? `${prefix}-${toKebabCase(key)}` : toKebabCase(key);

    if (isComponentPlatformIntent(value)) {
      names.push(`--${name}`);
      continue;
    }

    if (isPlainObject(value)) {
      names.push(...collectCssVariableNames(value, name));
      continue;
    }

    if (typeof value === 'string' || typeof value === 'number') {
      names.push(`--${name}`);
    }
  }

  return sortValues(names);
}

function collectUniqueValues(valuesBySource: readonly string[][]): string[] {
  return sortValues(Array.from(new Set(valuesBySource.flat())));
}

function formatConstArray(name: string, values: readonly string[]): string {
  if (values.length <= 3) {
    return `export const ${name} = [${values
      .map((value) => `'${value}'`)
      .join(', ')}] as const;\n`;
  }

  const items = values.map((value) => `  '${value}',`).join('\n');

  return `export const ${name} = [\n${items}\n] as const;\n`;
}

const themes = [lightTheme, darkTheme, highContrastTheme] as const;

const colorTokenPaths = collectUniqueValues(
  themes.map((theme) => collectTokenPaths(theme.colors, 'colors'))
);
const semanticTokenPaths = collectUniqueValues(
  themes.map((theme) => collectTokenPaths(theme.semantic, 'semantic'))
);
const componentTokenPaths = collectUniqueValues(
  themes.map((theme) => collectTokenPaths(theme.components, 'components'))
);
const baseTokenPaths = collectTokenPaths(lightTheme.tokens, 'tokens');
const tokenPaths = [
  ...baseTokenPaths,
  ...colorTokenPaths,
  ...componentTokenPaths,
  ...semanticTokenPaths,
];
sortValues(tokenPaths);

const baseCssVariableNames = [
  ...collectCssVariableNames(lightTheme.tokens.spacing, 'space'),
  ...collectCssVariableNames(lightTheme.tokens.radius, 'radius'),
  ...collectCssVariableNames(lightTheme.tokens.zIndex, 'z-index'),
  ...collectCssVariableNames(
    lightTheme.tokens.typography.family,
    'font-family'
  ),
  ...collectCssVariableNames(
    lightTheme.tokens.typography.weight,
    'font-weight'
  ),
  ...collectCssVariableNames(lightTheme.tokens.typography.size, 'font-size'),
  ...collectCssVariableNames(
    lightTheme.tokens.typography.lineHeight,
    'line-height'
  ),
  ...Object.keys(lightTheme.tokens.shadows).map((key) => `--shadow-${key}`),
];
sortValues(baseCssVariableNames);

const themeCssVariableNames = collectUniqueValues(
  themes.map((theme) => [
    ...collectCssVariableNames(theme.colors, 'color'),
    ...collectCssVariableNames(theme.semantic, ''),
    ...collectCssVariableNames(theme.components, ''),
    ...componentTokenWebCompatibilityAliases.map(({ variable }) => variable),
  ])
);

const cssVariableNames = Array.from(
  new Set([...baseCssVariableNames, ...themeCssVariableNames])
);
sortValues(cssVariableNames);

const themeNames = collectUniqueValues(themes.map((theme) => [theme.name]));

const content = `/**
 * AUTO-GENERATED FILE
 * DO NOT EDIT MANUALLY
 * Generated by scripts/generate-token-types.ts
 */

import type { darkTheme } from '../dark/theme.js';
import type { highContrastTheme } from '../highContrast/theme.js';
import type { lightTheme } from '../light/theme.js';
import type { ComponentPlatformIntent } from '../platform-output/component-token-intents.js';

${formatConstArray('themeNames', themeNames)}
${formatConstArray('colorTokenPaths', colorTokenPaths)}
${formatConstArray('semanticTokenPaths', semanticTokenPaths)}
${formatConstArray('componentTokenPaths', componentTokenPaths)}
${formatConstArray('baseTokenPaths', baseTokenPaths)}
${formatConstArray('tokenPaths', tokenPaths)}
${formatConstArray('baseCssVariableNames', baseCssVariableNames)}
${formatConstArray('themeCssVariableNames', themeCssVariableNames)}
${formatConstArray('cssVariableNames', cssVariableNames)}
export type ThemeName = (typeof themeNames)[number];
export type ColorTokenPath = (typeof colorTokenPaths)[number];
export type SemanticTokenPath = (typeof semanticTokenPaths)[number];
export type ComponentTokenPath = (typeof componentTokenPaths)[number];
export type BaseTokenPath = (typeof baseTokenPaths)[number];
export type TokenPath = (typeof tokenPaths)[number];
export type BaseCssVariableName = (typeof baseCssVariableNames)[number];
export type ThemeCssVariableName = (typeof themeCssVariableNames)[number];
export type CssVariableName = (typeof cssVariableNames)[number];

export type WidenTokenValues<T> = T extends ComponentPlatformIntent
  ? T
  : {
  readonly [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends number
      ? number
      : T[K] extends boolean
        ? boolean
        : T[K] extends object
          ? WidenTokenValues<T[K]>
          : T[K];
    };

export type LightTheme = WidenTokenValues<typeof lightTheme>;
export type DarkTheme = WidenTokenValues<typeof darkTheme>;
export type HighContrastTheme = WidenTokenValues<typeof highContrastTheme>;
export type VelliraTheme = LightTheme | DarkTheme | HighContrastTheme;
export type VelliraColors = VelliraTheme['colors'];
export type VelliraSemanticTokens = VelliraTheme['semantic'];
export type VelliraComponentTokens = VelliraTheme['components'];
export type VelliraBaseTokens = VelliraTheme['tokens'];
`;

if (checkMode) {
  const current = fs.existsSync(outputPath)
    ? fs.readFileSync(outputPath, 'utf8')
    : '';

  if (current !== content) {
    console.error(
      'Generated token types are out of date. Run `pnpm --filter @vellira-ui/tokens generate:types`.'
    );
    process.exit(1);
  }

  console.log('✅ token types are up to date');
  process.exit(0);
}

fs.mkdirSync(path.dirname(outputPath), {
  recursive: true,
});

writeFileIfChanged(outputPath, content);

console.log('✅ token types generated');
console.log(outputPath);
