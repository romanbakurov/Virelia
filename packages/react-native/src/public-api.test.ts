import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { componentTokenPaths } from '@vellira-ui/tokens';
import { describe, expect, it } from 'vitest';

import * as api from './index';
import { nativeThemes } from './theme';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const getRuntimeExports = (source: string) => {
  const exports = new Set<string>();
  const exportPattern = /^export\s+\{\s*([^}]+)\s*\}/gm;
  let match: RegExpExecArray | null;

  while ((match = exportPattern.exec(source))) {
    match[1]
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .forEach((entry) => {
        const [, alias = entry] = entry.split(/\s+as\s+/);

        exports.add(alias.trim());
      });
  }

  return [...exports].sort();
};

const getValueByPath = (source: unknown, tokenPath: string) =>
  tokenPath
    .split('.')
    .reduce<unknown>(
      (value, segment) =>
        value && typeof value === 'object'
          ? (value as Record<string, unknown>)[segment]
          : undefined,
      source
    );

describe('public API', () => {
  it('exports only documented runtime entries', () => {
    expect(Object.keys(api).sort()).toEqual([
      'Button',
      'Checkbox',
      'Dropdown',
      'FormField',
      'Input',
      'Modal',
      'Portal',
      'PortalProvider',
      'Radio',
      'RadioGroup',
      'Select',
      'Tabs',
      'ThemeProvider',
      'Tooltip',
      'nativeThemes',
      'useTheme',
    ]);
  });

  it('contains every web runtime export', () => {
    const webIndex = readFileSync(
      path.resolve(dirname, '../../react/src/index.ts'),
      'utf8'
    );

    expect(Object.keys(api)).toEqual(
      expect.arrayContaining(getRuntimeExports(webIndex))
    );
  });

  it('keeps every component token path available to native themes', () => {
    for (const [themeName, theme] of Object.entries(nativeThemes)) {
      const missingTokens = componentTokenPaths.filter(
        (tokenPath) => getValueByPath(theme, tokenPath) === undefined
      );

      expect(missingTokens, `${themeName} missing component tokens`).toEqual(
        []
      );
    }
  });
});
