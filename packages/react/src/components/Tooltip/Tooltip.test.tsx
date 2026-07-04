import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils/render';

import { TooltipContent } from './Content/TooltipContent';
import { Tooltip } from './Tooltip';

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
});

describe('Tooltip', () => {
  it('renders tooltip content with placement metadata', () => {
    const arrowRef = { current: null };
    const { container, unmount } = render(
      <TooltipContent
        id='tip'
        role='tooltip'
        content='Helpful text'
        placement='top-start'
        arrowRef={arrowRef}
        arrowX={12}
        arrowY={8}
        style={{ maxWidth: '18rem' }}
      />
    );

    const tooltip = container.querySelector('[role="tooltip"]');
    const arrow = tooltip?.querySelector<HTMLDivElement>('div');

    expect(tooltip?.id).toBe('tip');
    expect(tooltip?.getAttribute('data-placement')).toBe('top-start');
    expect(tooltip?.textContent).toContain('Helpful text');
    expect(tooltip?.style.maxWidth).toBe('18rem');
    expect(arrow?.style.left).toBe('12px');
    expect(arrow?.style.top).toBe('8px');
    expect(arrow?.style.bottom).toBe('-5px');

    unmount();
  });

  it('does not open when disabled', () => {
    const { container, unmount } = render(
      <Tooltip content='Disabled tooltip' disabled>
        <button type='button'>Trigger</button>
      </Tooltip>
    );

    const trigger = container.querySelector('button');

    act(() => {
      trigger?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    });

    expect(document.body.textContent).not.toContain('Disabled tooltip');

    unmount();
  });

  it('opens when enabled', () => {
    vi.useFakeTimers();
    const onOpenChange = vi.fn();

    const { container, unmount } = render(
      <Tooltip
        content='Helpful tooltip'
        maxWidth='20rem'
        onOpenChange={onOpenChange}
      >
        <button type='button'>Trigger</button>
      </Tooltip>
    );

    const trigger = container.firstElementChild;

    act(() => {
      trigger?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      vi.advanceTimersByTime(300);
    });

    expect(document.body.textContent).toContain('Helpful tooltip');
    expect(document.querySelector('[role="tooltip"]')?.style.maxWidth).toBe(
      '20rem'
    );
    expect(onOpenChange).toHaveBeenCalledWith(true);

    unmount();
    vi.useRealTimers();
  });

  it('opens from focus and skips rendering empty content', () => {
    const { container, rerender, unmount } = render(
      <Tooltip content='Focused tooltip' delay={{ open: 0, close: 0 }}>
        <button type='button'>Trigger</button>
      </Tooltip>
    );

    const trigger = container.firstElementChild;

    act(() => {
      trigger?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    });

    expect(document.body.textContent).toContain('Focused tooltip');

    rerender(
      <Tooltip content='' delay={{ open: 0, close: 0 }}>
        <button type='button'>Trigger</button>
      </Tooltip>
    );

    act(() => {
      trigger?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    });

    expect(document.querySelector('[role="tooltip"]')).toBeNull();

    unmount();
  });
});
