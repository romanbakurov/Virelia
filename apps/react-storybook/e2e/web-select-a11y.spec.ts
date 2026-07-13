import { createRequire } from 'node:module';
import path from 'node:path';

import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

const require = createRequire(__filename);
const dirname = __dirname;
const axePath = require.resolve('axe-core/axe.min.js', {
  paths: [path.resolve(dirname, '../../../packages/react')],
});

const themes = ['light', 'dark', 'high-contrast'] as const;

const storyUrl = (id: string, theme: (typeof themes)[number]) =>
  `/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`;

async function openStory(
  page: Page,
  id: string,
  theme: (typeof themes)[number]
) {
  await page.goto(storyUrl(id, theme));
  await expect(page.locator('#storybook-root')).toBeVisible();
}

async function expectNoAxeViolations(page: Page) {
  await page.addScriptTag({ path: axePath });

  const violations = await page.evaluate(async () => {
    const axe = (
      window as Window &
        typeof globalThis & {
          axe: {
            run: (
              context: Element | Document,
              options: unknown
            ) => Promise<{
              violations: Array<{
                id: string;
                help: string;
                nodes: Array<{ target: string[]; failureSummary?: string }>;
              }>;
            }>;
          };
        }
    ).axe;

    const results = await axe.run(document.body, {
      rules: {
        region: { enabled: false },
      },
    });

    return results.violations.map((violation) => ({
      id: violation.id,
      help: violation.help,
      nodes: violation.nodes.map((node) => ({
        target: node.target,
        failureSummary: node.failureSummary,
      })),
    }));
  });

  expect(
    violations,
    violations
      .map(
        (violation) =>
          `${violation.id}: ${violation.help}\n${violation.nodes
            .map((node) => `  ${node.target.join(', ')} ${node.failureSummary}`)
            .join('\n')}`
      )
      .join('\n\n')
  ).toHaveLength(0);
}

test.describe('web Select accessibility', () => {
  for (const theme of themes) {
    test(`states story has no axe violations in ${theme}`, async ({ page }) => {
      await openStory(page, 'components-select--states', theme);

      await expectNoAxeViolations(page);
    });

    test(`open dropdown story has no axe violations in ${theme}`, async ({
      page,
    }) => {
      await openStory(page, 'components-select--open-dropdown', theme);
      await expect(page.getByRole('listbox')).toBeVisible();

      await expectNoAxeViolations(page);
    });
  }
});
