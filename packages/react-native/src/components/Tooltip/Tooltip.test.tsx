import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';

import { Tooltip } from './Tooltip';

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
});

describe('Native Tooltip', () => {
  it('shows content on long press and hides automatically', () => {
    vi.useFakeTimers();

    const { container, unmount } = render(
      <Tooltip content='Helpful text'>
        <span>Show help</span>
      </Tooltip>
    );

    expect(document.body.textContent).not.toContain('Helpful text');

    const trigger = container.querySelector<HTMLButtonElement>('button');

    act(() => {
      trigger?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    });

    expect(document.body.textContent).toContain('Helpful text');

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(document.body.textContent).not.toContain('Helpful text');

    unmount();
  });

  it('does not show content when disabled', () => {
    vi.useFakeTimers();

    const { container, unmount } = render(
      <Tooltip content='Disabled tooltip' disabled>
        <span>Show help</span>
      </Tooltip>
    );

    const trigger = container.querySelector('button');

    act(() => {
      trigger?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    });

    expect(document.body.textContent).not.toContain('Disabled tooltip');

    unmount();
  });

  it('supports bottom placement', () => {
    vi.useFakeTimers();

    const { container, unmount } = render(
      <Tooltip content='Bottom tooltip' placement='bottom'>
        <span>Show help</span>
      </Tooltip>
    );

    const trigger = container.querySelector('button');

    act(() => {
      trigger?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    });

    expect(document.body.textContent).toContain('Bottom tooltip');

    unmount();
  });
});
