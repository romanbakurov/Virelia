import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

const storyUrl = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

async function openStory(page: Page, id: string) {
  await page.goto(storyUrl(id));
  await expect(page.locator('#storybook-root')).toBeVisible();
}

async function expectPortaled(page: Page, selector: string) {
  await expect(page.locator(`#storybook-root ${selector}`)).toHaveCount(0);
  await expect(
    page.locator(`body > ${selector}, body ${selector}`)
  ).toBeVisible();
}

async function expectFloatingNearReference(
  reference: Locator,
  floating: Locator
) {
  const referenceBox = await reference.boundingBox();
  const floatingBox = await floating.boundingBox();

  expect(referenceBox).not.toBeNull();
  expect(floatingBox).not.toBeNull();

  expect(floatingBox!.width).toBeGreaterThan(0);
  expect(floatingBox!.height).toBeGreaterThan(0);
  expect(floatingBox!.y).toBeGreaterThanOrEqual(referenceBox!.y - 8);
  expect(floatingBox!.x + floatingBox!.width).toBeGreaterThan(referenceBox!.x);
  expect(floatingBox!.x).toBeLessThan(referenceBox!.x + referenceBox!.width);
}

test.describe('web overlays', () => {
  test('Dropdown supports keyboard navigation, focus restore, portal, outside click, and positioning', async ({
    page,
  }) => {
    await openStory(page, 'components-dropdown--text-only');

    const trigger = page.getByRole('button', { name: 'Actions' });
    await trigger.focus();
    await page.keyboard.press('Enter');

    const menu = page.getByRole('menu', { name: 'Actions' });
    await expect(menu).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toBeFocused();
    await expectPortaled(page, '[role="menu"]');
    await expectFloatingNearReference(trigger, menu);

    await page.keyboard.press('ArrowDown');
    await expect(menu).toHaveAttribute('aria-activedescendant', /item-1$/);

    await page.mouse.click(4, 4);
    await expect(menu).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.focus();
    await page.keyboard.press('Space');
    await expect(menu).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('Select keeps focus on the trigger, closes on Escape, portals listbox, and matches trigger width', async ({
    page,
  }) => {
    await openStory(page, 'components-select--basic');

    const trigger = page.getByRole('combobox', { name: 'Country' });
    await trigger.focus();
    await trigger.press('Enter');

    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(listbox).toHaveAttribute(
      'aria-labelledby',
      await trigger.getAttribute('id')
    );
    await expectPortaled(page, '[role="listbox"]');

    const triggerBox = await trigger.boundingBox();
    const listboxBox = await listbox.boundingBox();
    expect(triggerBox).not.toBeNull();
    expect(listboxBox).not.toBeNull();

    const viewportSize = page.viewportSize();
    expect(viewportSize).not.toBeNull();

    const isMobileSheet = viewportSize!.width < 640;

    if (!isMobileSheet) {
      expect(
        Math.abs(listboxBox!.width - triggerBox!.width)
      ).toBeLessThanOrEqual(1);

      await expectFloatingNearReference(trigger, listbox);
    } else {
      expect(listboxBox!.x).toBeGreaterThanOrEqual(0);
      expect(listboxBox!.x + listboxBox!.width).toBeLessThanOrEqual(
        viewportSize!.width
      );
      expect(listboxBox!.width).toBeGreaterThanOrEqual(triggerBox!.width);
    }

    await page.keyboard.press('ArrowDown');
    await expect(trigger).toHaveAttribute('aria-activedescendant', /option-1$/);

    await page.keyboard.press('Escape');
    await expect(listbox).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  });

  test('Tooltip opens from focus, renders through a portal, and stays within the viewport', async ({
    page,
  }) => {
    await openStory(page, 'components-tooltip--no-delay');

    const trigger = page.getByRole('button', { name: 'Instant Tooltip' });
    await trigger.focus();

    const tooltip = page.getByRole('tooltip');
    await expect(tooltip).toBeVisible();
    await expect(trigger.locator('xpath=..')).toHaveAttribute(
      'aria-describedby',
      await tooltip.getAttribute('id')
    );
    await expectPortaled(page, '[role="tooltip"]');

    const box = await tooltip.boundingBox();
    const viewport = page.viewportSize();
    expect(box).not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width);
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height);
  });

  test('Modal renders in a portal, traps focus, and closes with Escape', async ({
    page,
  }) => {
    await openStory(page, 'components-modal--basic');

    const opener = page.getByRole('button', { name: 'Open Modal' });
    await opener.click();

    const dialog = page.getByRole('dialog', { name: 'Delete file' });
    await expect(dialog).toBeVisible();
    await expectPortaled(page, '[role="dialog"]');
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

    await page.keyboard.press('Tab');
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  });
});
