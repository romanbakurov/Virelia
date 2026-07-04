import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectNoA11yViolations } from '../../test-utils/a11y';
import { render } from '../../test-utils/render';

import { Dropdown } from './Dropdown';

const items = [
  { label: 'Edit', value: 'edit' },
  { label: 'Archive', value: 'archive', disabled: true },
  { label: 'Delete', value: 'delete', danger: true },
];

function pressKey(target: EventTarget, key: string) {
  act(() => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  });
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Dropdown', () => {
  it('opens menu and selects an enabled item', () => {
    const onSelect = vi.fn();
    const { container, unmount } = render(
      <Dropdown
        label='Actions'
        trigger='Actions'
        items={items}
        onSelect={onSelect}
      />
    );

    const trigger = container.querySelector<HTMLButtonElement>('button');
    act(() => trigger?.click());

    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelector('[role="menu"]')).not.toBeNull();

    const firstItem = document.querySelector<HTMLElement>('[role="menuitem"]');
    act(() => firstItem?.click());

    expect(onSelect).toHaveBeenCalledWith('edit');
    expect(document.querySelector('[role="menu"]')).toBeNull();

    unmount();
  });

  it('opens and selects the active item from keyboard', async () => {
    const onSelect = vi.fn();
    const { container, unmount } = render(
      <Dropdown
        label='Actions'
        trigger='Actions'
        items={items}
        onSelect={onSelect}
      />
    );

    const trigger = container.querySelector<HTMLButtonElement>('button');

    pressKey(trigger!, 'Enter');

    const menu = document.querySelector('[role="menu"]');
    const menuItems = document.querySelectorAll('[role="menuitem"]');

    await expectNoA11yViolations(document.body);

    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(trigger?.getAttribute('aria-controls')).toBe(menu?.id);
    expect(menu?.getAttribute('aria-labelledby')).toBe(trigger?.id);
    expect(document.activeElement).toBe(menu);
    expect(menu?.getAttribute('aria-activedescendant')).toBe(
      `${menu?.id}-item-0`
    );
    expect(document.getElementById(`${menu?.id}-item-0`)).not.toBeNull();
    expect(menuItems[1]?.getAttribute('aria-disabled')).toBe('true');

    pressKey(menu!, 'ArrowDown');

    expect(menu?.getAttribute('aria-activedescendant')).toBe(
      `${menu?.id}-item-2`
    );

    pressKey(menu!, 'Enter');

    expect(onSelect).toHaveBeenCalledWith('delete');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(document.querySelector('[role="menu"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);

    unmount();
  });

  it('closes from keyboard with Escape', () => {
    const onSelect = vi.fn();
    const { container, unmount } = render(
      <Dropdown
        label='Actions'
        trigger='Actions'
        items={items}
        onSelect={onSelect}
      />
    );

    const trigger = container.querySelector<HTMLButtonElement>('button');

    pressKey(trigger!, ' ');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');

    const menu = document.querySelector('[role="menu"]');
    expect(document.activeElement).toBe(menu);

    pressKey(menu!, 'Escape');

    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(document.querySelector('[role="menu"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(onSelect).not.toHaveBeenCalled();

    unmount();
  });

  it('does not open when disabled', () => {
    const { container, unmount } = render(
      <Dropdown disabled label='Actions' trigger='Actions' items={items} />
    );

    const trigger = container.querySelector<HTMLButtonElement>('button');
    act(() => trigger?.click());

    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelector('[role="menu"]')).toBeNull();

    unmount();
  });

  it('renders groups, separators, icons, shortcuts, and wrapped item text', () => {
    const onSelect = vi.fn();
    const { container, unmount } = render(
      <Dropdown
        label='Actions'
        trigger='Actions'
        textWrap='wrap'
        items={[
          { type: 'group', label: 'File' },
          {
            label: 'Duplicate',
            value: 'duplicate',
            icon: <span data-testid='duplicate-icon' />,
            shortcut: '⌘D',
          },
          { type: 'separator' },
          { label: 'Disabled', value: 'disabled', disabled: true },
        ]}
        onSelect={onSelect}
      />
    );

    const trigger = container.querySelector<HTMLButtonElement>('button');
    act(() => trigger?.click());

    expect(document.body.textContent).toContain('File');
    expect(document.querySelector('[role="separator"]')).not.toBeNull();
    expect(
      document.querySelector('[data-testid="duplicate-icon"]')
    ).not.toBeNull();
    expect(document.body.textContent).toContain('⌘D');

    const disabledItem = Array.from(
      document.querySelectorAll<HTMLElement>('[role="menuitem"]')
    ).find((item) => item.textContent?.includes('Disabled'));

    act(() => disabledItem?.click());
    expect(onSelect).not.toHaveBeenCalled();

    act(() =>
      disabledItem?.dispatchEvent(
        new MouseEvent('mouseover', { bubbles: true })
      )
    );
    expect(disabledItem?.getAttribute('data-active')).toBeNull();

    unmount();
  });

  it('supports icon-only triggers and closes on outside pointer down', () => {
    const { container, unmount } = render(
      <Dropdown
        label='More actions'
        icon={<span data-testid='trigger-icon' />}
        showArrow={false}
        items={items}
      />
    );

    const trigger = container.querySelector<HTMLButtonElement>('button');

    expect(trigger?.getAttribute('aria-label')).toBe('More actions');
    expect(
      container.querySelector('[data-testid="trigger-icon"]')
    ).not.toBeNull();

    act(() => trigger?.click());

    const menu = document.querySelector('[role="menu"]');
    expect(menu).not.toBeNull();
    expect(menu?.getAttribute('aria-label')).toBe('More actions');

    act(() => {
      document.body.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true })
      );
    });

    expect(document.querySelector('[role="menu"]')).toBeNull();

    unmount();
  });
});
