import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { beforeAll, describe, expect, it } from 'vitest';

import { darkTheme, highContrastTheme, lightTheme } from '../src/index.js';

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const generatedCssPath = path.join(packageRoot, 'src/generated/tokens.css');

let css = '';

beforeAll(async () => {
  await import('./generate-css.js');
  css = fs.readFileSync(generatedCssPath, 'utf8');
});

function readThemeBlock(selector: string): string {
  const marker = `${selector} {\n`;
  const start = css.indexOf(marker);

  if (start === -1) {
    throw new Error(`Missing generated theme block: ${selector}`);
  }

  const bodyStart = start + marker.length;
  const end = css.indexOf('\n}\n', bodyStart);

  if (end === -1) {
    throw new Error(`Unterminated generated theme block: ${selector}`);
  }

  return css.slice(bodyStart, end);
}

describe('generated Accordion CSS variables', () => {
  const cases = [
    {
      name: 'light',
      selector: ":root,\n[data-theme='light'],\n[data-vellira-theme='light']",
      theme: lightTheme,
    },
    {
      name: 'dark',
      selector: "[data-theme='dark'],\n[data-vellira-theme='dark']",
      theme: darkTheme,
    },
    {
      name: 'high-contrast',
      selector:
        "[data-theme='high-contrast'],\n[data-vellira-theme='high-contrast']",
      theme: highContrastTheme,
    },
  ] as const;

  for (const { name, selector, theme } of cases) {
    it(`emits the complete Accordion contract in the ${name} theme block`, () => {
      const block = readThemeBlock(selector);
      const accordion = theme.components.accordion;

      const expected = [
        ['--accordion-root-bg', accordion.root.bg],
        ['--accordion-root-border', accordion.root.border],
        ['--accordion-divider', accordion.divider],
        ['--accordion-trigger-default-bg', accordion.trigger.default.bg],
        ['--accordion-trigger-default-fg', accordion.trigger.default.fg],
        ['--accordion-trigger-expanded-bg', accordion.trigger.expanded.bg],
        ['--accordion-trigger-hover-bg', accordion.trigger.hover.bg],
        ['--accordion-trigger-hover-fg', accordion.trigger.hover.fg],
        ['--accordion-trigger-pressed-bg', accordion.trigger.pressed.bg],
        ['--accordion-trigger-pressed-fg', accordion.trigger.pressed.fg],
        ['--accordion-trigger-disabled-bg', accordion.trigger.disabled.bg],
        ['--accordion-trigger-disabled-fg', accordion.trigger.disabled.fg],
        ['--accordion-indicator', accordion.indicator],
        ['--accordion-content-bg', accordion.content.bg],
        ['--accordion-content-fg', accordion.content.fg],
        ['--accordion-focus-ring', accordion.focusRing],
      ] as const;

      for (const [variable, value] of expected) {
        expect(block).toContain(`  ${variable}: ${value};`);
      }
    });
  }
});
