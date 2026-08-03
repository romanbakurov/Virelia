import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

const storyUrl = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

async function openStory(page: Page, id: string) {
  await page.goto(storyUrl(id));
  await expect(page.locator('#storybook-root')).toBeVisible();

  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

test.describe('web Button', () => {
  test('matrix is visually stable across color and appearance states', async ({
    page,
  }, testInfo) => {
    await openStory(page, 'primitives-button--matrix');

    const matrix = page.getByRole('heading', { name: 'Matrix' }).locator('..');

    await expect(matrix).toBeVisible();
    await expect(matrix.getByRole('button')).toHaveCount(25);
    const firstButton = matrix.getByRole('button').first();

    console.log(
      await firstButton.evaluate((element) => {
        const styles = getComputedStyle(element);

        return {
          fontFamily: styles.fontFamily,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          lineHeight: styles.lineHeight,
          letterSpacing: styles.letterSpacing,
        };
      })
    );

    console.log('Viewport:', page.viewportSize());

    console.log(
      'Matrix:',
      await matrix.evaluate((el) => ({
        width: el.getBoundingClientRect().width,
        height: el.getBoundingClientRect().height,
      }))
    );

    console.log(
      'Fonts:',
      await page.evaluate(() => ({
        ready: document.fonts.status,
        velliraSansLoaded: document.fonts.check('16px "Vellira Sans"'),
        loadedFonts: [...document.fonts].map((font) => ({
          family: font.family,
          weight: font.weight,
          status: font.status,
        })),
      }))
    );
    await expect(matrix).toHaveScreenshot(
      `web-button-matrix-${testInfo.project.name}.png`,
      {
        maxDiffPixelRatio: 0.02,
      }
    );
  });

  test('pseudo states render distinct visual styles', async ({ page }) => {
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
