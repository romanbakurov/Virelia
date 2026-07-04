import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';

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
});
