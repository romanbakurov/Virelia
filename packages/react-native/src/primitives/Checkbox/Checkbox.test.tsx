import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';

import { Checkbox } from './Checkbox';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Native Checkbox', () => {
  it('toggles uncontrolled value and calls onCheckedChange', () => {
    const onCheckedChange = vi.fn();
    const { container, unmount } = render(
      <Checkbox label='Accept' onCheckedChange={onCheckedChange} />
    );

    const checkbox =
      container.querySelector<HTMLButtonElement>('[role="checkbox"]');

    expect(checkbox?.getAttribute('aria-checked')).toBe('false');
    act(() => checkbox?.click());
    expect(checkbox?.getAttribute('aria-checked')).toBe('true');
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    unmount();
  });

  it('uses the label as the accessible name', () => {
    const { container, unmount } = render(<Checkbox label='Accept terms' />);

    const checkbox =
      container.querySelector<HTMLButtonElement>('[role="checkbox"]');

    expect(checkbox?.getAttribute('aria-label')).toBe('Accept terms');

    unmount();
  });

  it('keeps controlled value until checked changes', () => {
    const onCheckedChange = vi.fn();
    const { container, rerender, unmount } = render(
      <Checkbox
        label='Accept'
        checked={false}
        onCheckedChange={onCheckedChange}
      />
    );

    const checkbox =
      container.querySelector<HTMLButtonElement>('[role="checkbox"]');

    act(() => checkbox?.click());

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox?.getAttribute('aria-checked')).toBe('false');

    rerender(
      <Checkbox label='Accept' checked onCheckedChange={onCheckedChange} />
    );

    expect(checkbox?.getAttribute('aria-checked')).toBe('true');

    unmount();
  });

  it('marks disabled state and ignores presses', () => {
    const onCheckedChange = vi.fn();
    const { container, unmount } = render(
      <Checkbox
        label='Accept'
        disabled
        defaultChecked
        onCheckedChange={onCheckedChange}
      />
    );

    const checkbox =
      container.querySelector<HTMLButtonElement>('[role="checkbox"]');

    expect(checkbox?.getAttribute('aria-disabled')).toBe('true');
    expect(checkbox?.getAttribute('aria-checked')).toBe('true');

    act(() => checkbox?.click());

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(checkbox?.getAttribute('aria-checked')).toBe('true');

    unmount();
  });
});
