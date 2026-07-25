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
      <Tooltip>
        <Tooltip.Trigger>
          <span>Show help</span>
        </Tooltip.Trigger>
        <Tooltip.Content>Helpful text</Tooltip.Content>
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
      <Tooltip disabled>
        <Tooltip.Trigger>
          <span>Show help</span>
        </Tooltip.Trigger>
        <Tooltip.Content>Disabled tooltip</Tooltip.Content>
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
      <Tooltip placement='bottom'>
        <Tooltip.Trigger>
          <span>Show help</span>
        </Tooltip.Trigger>
        <Tooltip.Content>Bottom tooltip</Tooltip.Content>
      </Tooltip>
    );

    const trigger = container.querySelector('button');

    act(() => {
      trigger?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    });

    expect(document.body.textContent).toContain('Bottom tooltip');

    unmount();
  });

  it('supports controlled open state', () => {
    const onOpenChange = vi.fn();
    const { container, rerender, unmount } = render(
      <Tooltip open={false} onOpenChange={onOpenChange}>
        <Tooltip.Trigger>
          <span>Show help</span>
        </Tooltip.Trigger>
        <Tooltip.Content>Controlled tooltip</Tooltip.Content>
      </Tooltip>
    );

    expect(document.body.textContent).not.toContain('Controlled tooltip');

    const trigger = container.querySelector('button');

    act(() => {
      trigger?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    });

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(document.body.textContent).not.toContain('Controlled tooltip');

    rerender(
      <Tooltip open onOpenChange={onOpenChange}>
        <Tooltip.Trigger>
          <span>Show help</span>
        </Tooltip.Trigger>
        <Tooltip.Content>Controlled tooltip</Tooltip.Content>
      </Tooltip>
    );

    expect(document.body.textContent).toContain('Controlled tooltip');

    unmount();
  });

  it('supports defaultOpen content with arrow', () => {
    const { unmount } = render(
      <Tooltip defaultOpen placement='top'>
        <Tooltip.Trigger>
          <span>Show help</span>
        </Tooltip.Trigger>
        <Tooltip.Content>
          Open by default
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip>
    );

    const modal = document.querySelector('[data-testid="native-modal"]');
    const tooltip = modal?.querySelector('[id$="-content"]');
    const arrow = tooltip?.querySelector('div');

    expect(tooltip?.textContent).toContain('Open by default');
    expect(arrow).not.toBeNull();

    unmount();
  });

  it('uses open delay before showing content', () => {
    vi.useFakeTimers();

    const { container, unmount } = render(
      <Tooltip delay={{ open: 200, close: 2500 }}>
        <Tooltip.Trigger>
          <span>Show help</span>
        </Tooltip.Trigger>
        <Tooltip.Content>Delayed tooltip</Tooltip.Content>
      </Tooltip>
    );

    const trigger = container.querySelector('button');

    act(() => {
      trigger?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      vi.advanceTimersByTime(199);
    });

    expect(document.body.textContent).not.toContain('Delayed tooltip');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(document.body.textContent).toContain('Delayed tooltip');

    unmount();
  });

  it('applies content and text styles to Tooltip.Content', () => {
    const { unmount } = render(
      <Tooltip defaultOpen>
        <Tooltip.Trigger>
          <span>Show help</span>
        </Tooltip.Trigger>
        <Tooltip.Content
          style={{ maxWidth: 280 }}
          textStyle={{ fontWeight: '700' }}
        >
          Styled tooltip
        </Tooltip.Content>
      </Tooltip>
    );

    const tooltip = document.querySelector<HTMLDivElement>('[id$="-content"]');
    const text = tooltip?.querySelector('span');

    expect(tooltip?.style.maxWidth).toBe('280px');
    expect(text?.style.fontWeight).toBe('700');

    unmount();
  });

  it('keeps content mounted when forceMount is enabled', () => {
    const { unmount } = render(
      <Tooltip open={false}>
        <Tooltip.Trigger>
          <span>Show help</span>
        </Tooltip.Trigger>
        <Tooltip.Content forceMount>Force mounted tooltip</Tooltip.Content>
      </Tooltip>
    );

    const tooltip = document.querySelector<HTMLDivElement>('[id$="-content"]');

    expect(tooltip?.textContent).toContain('Force mounted tooltip');
    expect(tooltip?.style.display).toBe('none');
    expect(document.querySelector('[data-testid="native-modal"]')).toBeNull();

    unmount();
  });
});
