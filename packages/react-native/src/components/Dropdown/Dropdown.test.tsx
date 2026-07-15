import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';
import { nativeThemes, ThemeProvider } from '../../theme';

import { Dropdown } from './Dropdown';

const items = [
  { label: 'Edit', value: 'edit' },
  { label: 'Delete', value: 'delete', danger: true },
];

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Native Dropdown', () => {
  it('opens and selects an item', () => {
    const onSelect = vi.fn();
    const { container, unmount } = render(
      <Dropdown label='Actions' items={items} onSelect={onSelect} />
    );

    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');
    act(() => trigger?.click());

    expect(container.textContent).toContain('Edit');

    const editItem = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('Edit')
    );
    act(() => editItem?.click());

    expect(onSelect).toHaveBeenCalledWith('edit');

    unmount();
  });

  it('renders a text trigger safely', () => {
    const { container, unmount } = render(
      <Dropdown label='Actions' trigger='Actions' items={items} />
    );

    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');

    expect(trigger?.textContent).toContain('Actions');

    unmount();
  });

  it('applies the configured trigger size', () => {
    const { container, unmount } = render(
      <Dropdown label='Actions' trigger='Actions' size='lg' items={items} />
    );

    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');

    expect(trigger?.style.minHeight).toBe('52px');

    unmount();
  });

  it('renders grouped menu content and ignores disabled item presses', () => {
    const onSelect = vi.fn();
    const { container, unmount } = render(
      <Dropdown
        label='Actions'
        items={[
          { type: 'group', label: 'File' },
          { label: 'Archive', value: 'archive', disabled: true },
          { type: 'separator' },
          { label: 'Duplicate', value: 'duplicate', textWrap: 'wrap' },
        ]}
        onSelect={onSelect}
      />
    );

    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');
    act(() => trigger?.click());

    expect(container.textContent).toContain('File');
    expect(container.textContent).toContain('Archive');
    expect(container.querySelector('[role="heading"]')?.textContent).toContain(
      'File'
    );

    const archiveItem = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('Archive')
    );
    const duplicateItem = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('Duplicate')
    );

    expect(archiveItem?.disabled).toBe(true);

    act(() => archiveItem?.click());
    expect(onSelect).not.toHaveBeenCalled();

    act(() => duplicateItem?.click());
    expect(onSelect).toHaveBeenCalledWith('duplicate');

    unmount();
  });

  it('does not open when disabled and closes from backdrop', () => {
    const { container, rerender, unmount } = render(
      <Dropdown disabled label='Actions' items={items} />
    );

    let trigger = container.querySelector<HTMLButtonElement>('[role="button"]');

    act(() => trigger?.click());

    expect(container.textContent).not.toContain('Edit');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');

    rerender(
      <Dropdown
        label='Actions'
        icon={<span data-testid='trigger-icon' />}
        showArrow={false}
        items={items}
      />
    );

    trigger = container.querySelector<HTMLButtonElement>('[role="button"]');
    expect(
      container.querySelector('[data-testid="trigger-icon"]')
    ).not.toBeNull();

    act(() => trigger?.click());
    expect(container.textContent).toContain('Edit');

    const closeButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.getAttribute('aria-label') === 'Close menu'
    );

    act(() => closeButton?.click());

    expect(container.textContent).not.toContain('Edit');

    unmount();
  });

  it('supports controlled open state and reports open changes', () => {
    const onOpenChange = vi.fn();
    const { container, rerender, unmount } = render(
      <Dropdown
        label='Actions'
        items={items}
        open={false}
        onOpenChange={onOpenChange}
      />
    );

    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');

    act(() => trigger?.click());

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(container.textContent).not.toContain('Edit');

    rerender(
      <Dropdown
        label='Actions'
        items={items}
        open
        onOpenChange={onOpenChange}
      />
    );

    expect(container.textContent).toContain('Edit');

    const editItem = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('Edit')
    );

    act(() => editItem?.click());

    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    unmount();
  });

  it('passes accessibility label and hint to the trigger', () => {
    const { container, unmount } = render(
      <Dropdown
        label='Actions'
        accessibilityLabel='Project actions'
        accessibilityHint='Opens project action menu'
        items={items}
      />
    );

    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');

    expect(trigger?.getAttribute('aria-label')).toBe('Project actions');
    expect(trigger?.getAttribute('aria-description')).toBe(
      'Opens project action menu'
    );

    unmount();
  });

  it('labels the menu and falls back to item values for complex labels', () => {
    const { container, unmount } = render(
      <Dropdown
        label={<span>Actions</span>}
        accessibilityLabel='Project actions'
        items={[
          {
            label: <span data-testid='complex-label'>Copy link</span>,
            value: 'copy-link',
          },
        ]}
      />
    );

    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');
    act(() => trigger?.click());

    const menu = container.querySelector('[role="menu"]');
    const menuItem = container.querySelector('[role="menuitem"]');

    expect(menu?.getAttribute('aria-label')).toBe('Project actions');
    expect(menuItem?.getAttribute('aria-label')).toBe('copy-link');

    unmount();
  });

  it('renders repeated values with stable menuitem semantics', () => {
    const onSelect = vi.fn();
    const { container, unmount } = render(
      <Dropdown
        label='Actions'
        items={[
          { label: 'Copy link', value: 'copy' },
          { label: 'Copy markdown', value: 'copy' },
        ]}
        onSelect={onSelect}
      />
    );

    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');
    act(() => trigger?.click());

    const menuItems = container.querySelectorAll('[role="menuitem"]');

    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]?.textContent).toContain('Copy link');
    expect(menuItems[1]?.textContent).toContain('Copy markdown');

    act(() => (menuItems[1] as HTMLButtonElement | undefined)?.click());

    expect(onSelect).toHaveBeenCalledWith('copy');

    unmount();
  });

  it('maps textWrap values to native text truncation behavior', () => {
    const { container, unmount } = render(
      <Dropdown
        label='Actions'
        items={[
          { label: 'Truncate label', value: 'truncate' },
          { label: 'No wrap label', value: 'nowrap', textWrap: 'nowrap' },
          { label: 'Wrapped label', value: 'wrap', textWrap: 'wrap' },
        ]}
      />
    );

    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');
    act(() => trigger?.click());

    const truncateLabel = Array.from(container.querySelectorAll('span')).find(
      (element) => element.textContent === 'Truncate label'
    );
    const nowrapLabel = Array.from(container.querySelectorAll('span')).find(
      (element) => element.textContent === 'No wrap label'
    );
    const wrapLabel = Array.from(container.querySelectorAll('span')).find(
      (element) => element.textContent === 'Wrapped label'
    );

    expect(truncateLabel?.getAttribute('data-number-of-lines')).toBe('1');
    expect(truncateLabel?.getAttribute('data-ellipsize-mode')).toBe('tail');
    expect(nowrapLabel?.getAttribute('data-number-of-lines')).toBe('1');
    expect(nowrapLabel?.getAttribute('data-ellipsize-mode')).toBe('clip');
    expect(wrapLabel?.getAttribute('data-number-of-lines')).toBeNull();
    expect(wrapLabel?.getAttribute('data-ellipsize-mode')).toBe('clip');

    unmount();
  });

  it('supports empty items and content styles', () => {
    const { container, unmount } = render(
      <Dropdown
        label='Empty actions'
        items={[]}
        contentStyle={{ borderTopLeftRadius: 24 }}
      />
    );

    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');

    act(() => trigger?.click());

    const closeButton = Array.from(document.querySelectorAll('button')).find(
      (button) => button.getAttribute('aria-label') === 'Close menu'
    );
    const styledContent = Array.from(
      document.querySelectorAll<HTMLElement>('*')
    ).find((element) => element.style.borderTopLeftRadius === '24px');

    expect(closeButton).not.toBeNull();
    expect(document.querySelectorAll('[role="menuitem"]')).toHaveLength(0);
    expect(styledContent).not.toBeNull();

    unmount();
  });

  it('keeps disabled menus closed', () => {
    const onOpenChange = vi.fn();
    const { container, unmount } = render(
      <Dropdown
        disabled
        label='Disabled actions'
        items={items}
        onOpenChange={onOpenChange}
      />
    );

    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');

    act(() => trigger?.click());

    expect(container.textContent).not.toContain('Edit');
    expect(onOpenChange).not.toHaveBeenCalled();

    unmount();
  });

  it('colors item icons from dropdown item state tokens', () => {
    const Icon = ({ color }: { color?: string }) => (
      <span data-color={color} data-testid='item-icon' />
    );

    const { container, unmount } = render(
      <Dropdown
        label='Actions'
        items={[
          { label: 'Edit', value: 'edit', icon: <Icon /> },
          { label: 'Delete', value: 'delete', danger: true, icon: <Icon /> },
          {
            label: 'Archive',
            value: 'archive',
            disabled: true,
            icon: <Icon />,
          },
        ]}
      />
    );

    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');
    act(() => trigger?.click());

    const icons = Array.from(
      container.querySelectorAll<HTMLElement>('[data-testid="item-icon"]')
    );

    expect(icons.map((icon) => icon.dataset.color)).toEqual([
      nativeThemes.light.components.dropdown.item.default.fg,
      nativeThemes.light.components.dropdown.item.danger.default.fg,
      nativeThemes.light.components.dropdown.item.disabled.fg,
    ]);

    unmount();
  });

  it('keeps item icons and labels in sync with pressed colors', () => {
    const Icon = ({ color }: { color?: string }) => (
      <span data-color={color} data-testid='item-icon' />
    );

    const { container, unmount } = render(
      <Dropdown
        label='Actions'
        items={[
          { label: 'Edit', value: 'edit', icon: <Icon /> },
          { label: 'Delete', value: 'delete', danger: true, icon: <Icon /> },
        ]}
      />
    );

    const trigger =
      container.querySelector<HTMLButtonElement>('[role="button"]');
    act(() => trigger?.click());

    const editItem = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('Edit')
    );
    const deleteItem = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('Delete')
    );

    act(() => {
      editItem?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      deleteItem?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    const [editIcon, deleteIcon] = Array.from(
      container.querySelectorAll<HTMLElement>('[data-testid="item-icon"]')
    );

    expect(editIcon?.dataset.color).toBe(
      nativeThemes.light.components.dropdown.item.hover.fg
    );
    expect(deleteIcon?.dataset.color).toBe(
      nativeThemes.light.components.dropdown.item.danger.hover.fg
    );

    unmount();
  });

  it.each([
    ['dark', nativeThemes.dark.components.dropdown.item.default.fg],
    [
      'highContrast',
      nativeThemes.highContrast.components.dropdown.item.default.fg,
    ],
  ] as const)(
    'uses readable action icon colors in the %s theme',
    (themeName, expectedColor) => {
      const Icon = ({ color }: { color?: string }) => (
        <span data-color={color} data-testid='item-icon' />
      );

      const { container, unmount } = render(
        <ThemeProvider defaultTheme={themeName}>
          <Dropdown
            label='Actions'
            items={[{ label: 'Edit', value: 'edit', icon: <Icon /> }]}
          />
        </ThemeProvider>
      );

      const trigger =
        container.querySelector<HTMLButtonElement>('[role="button"]');
      act(() => trigger?.click());

      const icon = container.querySelector<HTMLElement>(
        '[data-testid="item-icon"]'
      );

      expect(icon?.dataset.color).toBe(expectedColor);

      unmount();
    }
  );
});
