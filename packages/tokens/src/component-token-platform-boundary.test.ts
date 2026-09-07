import { describe, expect, it } from 'vitest';

import { darkTheme } from './dark/theme.js';
import { highContrastTheme } from './highContrast/theme.js';
import { lightTheme } from './light/theme.js';
import { isComponentPlatformIntent } from './platform-output/component-token-intents.js';

type Finding = {
  path: string;
  reason: string;
};

const rendererKeys = new Set([
  'web',
  'native',
  'reactNative',
  'nativeMaxHeight',
]);

function scanCanonicalComponentTokens(
  value: unknown,
  path: string,
  findings: Finding[]
): void {
  if (isComponentPlatformIntent(value)) return;

  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      scanCanonicalComponentTokens(entry, `${path}.${index}`, findings)
    );
    return;
  }

  if (typeof value !== 'object' || value === null) {
    if (path.endsWith('.shadow') && typeof value === 'string') {
      findings.push({
        path,
        reason: 'canonical shadow contains renderer-specific CSS syntax',
      });
    }
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    const childPath = path ? `${path}.${key}` : key;

    if (rendererKeys.has(key)) {
      findings.push({
        path: childPath,
        reason: `renderer-specific canonical key "${key}"`,
      });
    }

    scanCanonicalComponentTokens(child, childPath, findings);
  }
}

const themes = [
  ['light', lightTheme],
  ['dark', darkTheme],
  ['high-contrast', highContrastTheme],
] as const;

describe('renderer-neutral canonical component token boundary', () => {
  it.each(themes)(
    'has no platform leakage in %s components',
    (_name, theme) => {
      const findings: Finding[] = [];

      scanCanonicalComponentTokens(theme.components, 'components', findings);

      expect(findings).toEqual([]);
    }
  );

  it('does not let renderer keys hide inside intent-shaped objects', () => {
    const findings: Finding[] = [];

    scanCanonicalComponentTokens(
      {
        content: {
          shadow: {
            kind: 'shadow',
            role: 'elevation',
            level: 'lg',
            web: '0 0 8px black',
          },
        },
      },
      'components.probe',
      findings
    );

    expect(findings).toEqual([
      {
        path: 'components.probe.content.shadow.web',
        reason: 'renderer-specific canonical key "web"',
      },
    ]);
  });
});
