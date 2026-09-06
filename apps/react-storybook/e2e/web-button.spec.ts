import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

const storyUrl = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

async function openStory(page: Page, id: string) {
  await page.goto(storyUrl(id));
  await expect(page.locator('#storybook-root')).toBeVisible();

  // Wait for fonts and two paint cycles so the story layout is stable.
  await page.evaluate(async () => {
    await document.fonts.ready;

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });
  });
}

test.describe('web Button', () => {
  test('@visual matrix is stable across color and appearance states', async ({
    page,
  }, testInfo) => {
    await openStory(page, 'primitives-button--matrix');

    const matrix = page.getByRole('heading', { name: 'Matrix' }).locator('..');

    await expect(matrix).toBeVisible();
    await expect(matrix.getByRole('button')).toHaveCount(25);
    await expect(matrix).toHaveScreenshot(
      `web-button-matrix-${testInfo.project.name}.png`,
      {
        maxDiffPixelRatio: 0.02,
      }
    );
  });

  test('pseudo states render distinct visual styles', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await openStory(page, 'primitives-button--matrix');

    const primarySolid = page.getByRole('button', { name: 'primary solid' });
    const primaryOutline = page.getByRole('button', {
      name: 'primary outline',
    });
    await primarySolid.hover();

    await expect(primarySolid).toHaveCSS(
      'transform',
      /matrix\(1, 0, 0, 1, 0, -1\)/
    );

    await page.mouse.down();

    await expect(primarySolid).toHaveCSS(
      'transform',
      /matrix\(0\.98, 0, 0, 0\.98, 0, 0\)/
    );

    await page.mouse.up();

    for (let index = 0; index < 4; index += 1) {
      if (
        await primaryOutline.evaluate((element) =>
          element.matches(':focus-visible')
        )
      ) {
        break;
      }

      await page.keyboard.press('Tab');
    }

    await expect(primaryOutline).toBeFocused();

    await expect(primaryOutline).toHaveCSS('outline-style', 'solid');
    await expect(primaryOutline).toHaveCSS('outline-width', '2px');
  });
});
