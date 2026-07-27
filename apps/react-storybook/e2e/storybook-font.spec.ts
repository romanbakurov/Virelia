import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

async function expectVelliraFont(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(() => document.fonts.check('16px  "Vellira Sans"'))
    )
    .toBe(true);
}

test.describe('Storybook typography', () => {
  test('uses Vellira font in story canvas', async ({ page }) => {
    await page.goto('/iframe.html?id=primitives-input--basic&viewMode=story');

    const root = page.locator('#storybook-root');
    await expect(root).toBeVisible();
    await expectVelliraFont(page);
    await expect(root).toHaveCSS('font-family', /Vellira Sans/);
    await expect(page.getByLabel('Email')).toHaveCSS(
      'font-family',
      /Vellira Sans/
    );
  });

  test('uses Vellira font in docs mode content', async ({ page }) => {
    await page.goto('/iframe.html?id=primitives-input--docs&viewMode=docs');

    const docs = page.locator('#storybook-docs');
    await expect(docs).toBeVisible();
    await expectVelliraFont(page);
    await expect(docs).toHaveCSS('font-family', /Vellira Sans/);
    await expect(
      page.getByRole('heading', { exact: true, name: 'Input' })
    ).toHaveCSS('font-family', /Vellira Sans/);
  });
});
