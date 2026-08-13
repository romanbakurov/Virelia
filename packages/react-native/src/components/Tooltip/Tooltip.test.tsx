import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import * as managers from '../../managers';
import { render } from '../../test-utils/render';

import { Tooltip } from './Tooltip';

const getTrigger = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('button, [tabindex="0"]');

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
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

    const trigger = getTrigger(container);

    act(() => {
      trigger?.click();
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

    const trigger = getTrigger(container);

    act(() => {
      trigger?.click();
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

    const trigger = getTrigger(container);

    act(() => {
      trigger?.click();
    });

    expect(document.body.textContent).toContain('Bottom tooltip');

    unmount();
  });

  it('opens on web press', () => {
    vi.useFakeTimers();

    const { container, unmount } = render(
      <Tooltip>
        <Tooltip.Trigger>
          <span>Show help</span>
        </Tooltip.Trigger>
        <Tooltip.Content>Focused tooltip</Tooltip.Content>
      </Tooltip>
    );

    const trigger = getTrigger(container);

    act(() => {
      trigger?.click();
    });

    expect(document.body.textContent).toContain('Focused tooltip');

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

    const trigger = getTrigger(container);

    act(() => {
      trigger?.click();
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
        <Tooltip.Content withArrow>Open by default</Tooltip.Content>
      </Tooltip>
    );

    const modal = document.querySelector('[data-testid="native-modal"]');
    const tooltip = modal?.querySelector('[id$="-content"]');
    const arrow = tooltip?.querySelector('div');

    expect(tooltip?.textContent).toContain('Open by default');
    expect(arrow).not.toBeNull();

    unmount();
  });

  it('supports the withArrow content prop', () => {
    const { unmount } = render(
      <Tooltip defaultOpen>
        <Tooltip.Trigger>
          <span>Show help</span>
        </Tooltip.Trigger>
        <Tooltip.Content withArrow>With arrow prop</Tooltip.Content>
      </Tooltip>
    );

    const tooltip = document.querySelector('[id$="-content"]');
    const arrow = tooltip?.querySelector('div');

    expect(tooltip?.textContent).toContain('With arrow prop');
    expect(arrow).not.toBeNull();

    unmount();
  });

  it('respects close delay before hiding content', () => {
    vi.useFakeTimers();

    const { container, unmount } = render(
      <Tooltip delay={{ open: 0, close: 200 }}>
        <Tooltip.Trigger>
          <span>Show help</span>
        </Tooltip.Trigger>
        <Tooltip.Content>Close delayed tooltip</Tooltip.Content>
      </Tooltip>
    );

    const trigger = getTrigger(container);

    act(() => {
      trigger?.click();
    });

    expect(document.body.textContent).toContain('Close delayed tooltip');

    act(() => {
      vi.advanceTimersByTime(199);
    });

    expect(document.body.textContent).toContain('Close delayed tooltip');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(document.body.textContent).not.toContain('Close delayed tooltip');

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

    const trigger = getTrigger(container);

    act(() => {
      trigger?.click();
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

  it('uses the resolved placement from FloatingManager', () => {
    vi.spyOn(managers, 'useNativeFloatingPosition').mockReturnValue({
      position: {
        top: 120,
        left: 80,
      },
      arrowPosition: {
        left: 32,
      },
      placement: 'bottom',
      updatePosition: vi.fn(),
      onFloatingLayout: vi.fn(),
    });

    const { unmount } = render(
      <Tooltip defaultOpen placement='top'>
        <Tooltip.Trigger>
          <span>Show help</span>
        </Tooltip.Trigger>
        <Tooltip.Content withArrow>Flipped tooltip</Tooltip.Content>
      </Tooltip>
    );

    const tooltip = document.querySelector<HTMLDivElement>('[id$="-content"]');
    const arrow = tooltip?.querySelector<HTMLDivElement>('div');

    expect(tooltip?.textContent).toContain('Flipped tooltip');

    // Requested placement is top, but FloatingManager resolved it to bottom.
    // The arrow therefore belongs on the top edge of the bubble.
    expect(arrow?.style.top).not.toBe('');
    expect(arrow?.style.bottom).toBe('');

    unmount();
  });

  it('uses the arrow position from FloatingManager', () => {
    vi.spyOn(managers, 'useNativeFloatingPosition').mockReturnValue({
      position: {
        top: 120,
        left: 12,
      },
      arrowPosition: {
        left: 24,
      },
      placement: 'top',
      updatePosition: vi.fn(),
      onFloatingLayout: vi.fn(),
    });

    const { unmount } = render(
      <Tooltip defaultOpen placement='top'>
        <Tooltip.Trigger>
          <span>Show help</span>
        </Tooltip.Trigger>
        <Tooltip.Content withArrow>Shifted tooltip</Tooltip.Content>
      </Tooltip>
    );

    const tooltip = document.querySelector<HTMLDivElement>('[id$="-content"]');
    const arrow = tooltip?.querySelector<HTMLDivElement>('div');

    expect(arrow?.style.left).toBe('24px');

    unmount();
  });

  it('opens and closes from web focus lifecycle', () => {
    vi.useFakeTimers();

    const { container, unmount } = render(
      <Tooltip delay={{ open: 0, close: 0 }}>
        <Tooltip.Trigger>
          <span>Focus trigger</span>
        </Tooltip.Trigger>
        <Tooltip.Content>Focus tooltip</Tooltip.Content>
      </Tooltip>
    );

    const trigger = getTrigger(container);

    expect(document.body.textContent).not.toContain('Focus tooltip');

    act(() => {
      trigger?.focus();
    });

    expect(document.body.textContent).toContain('Focus tooltip');

    act(() => {
      trigger?.blur();
      vi.runAllTimers();
    });

    expect(document.body.textContent).not.toContain('Focus tooltip');

    unmount();
  });

  it('opens from web hover and preserves content on mouse leave', () => {
    const { container, unmount } = render(
      <Tooltip>
        <Tooltip.Trigger>
          <span>Hover trigger</span>
        </Tooltip.Trigger>
        <Tooltip.Content>Hover tooltip</Tooltip.Content>
      </Tooltip>
    );

    const trigger = getTrigger(container);

    act(() => {
      trigger?.dispatchEvent(
        new MouseEvent('mouseover', {
          bubbles: true,
        })
      );
    });

    expect(document.body.textContent).toContain('Hover tooltip');

    act(() => {
      trigger?.dispatchEvent(
        new MouseEvent('mouseout', {
          bubbles: true,
        })
      );
    });

    // RN Web Tooltip intentionally does not immediately hide on mouse leave.
    expect(document.body.textContent).toContain('Hover tooltip');

    unmount();
  });

  it('forwards web trigger callbacks', () => {
    const onPress = vi.fn();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onHoverIn = vi.fn();
    const onHoverOut = vi.fn();

    const { container, unmount } = render(
      <Tooltip>
        <Tooltip.Trigger
          onPress={onPress}
          onFocus={onFocus}
          onBlur={onBlur}
          onHoverIn={onHoverIn}
          onHoverOut={onHoverOut}
        >
          <span>Callbacks</span>
        </Tooltip.Trigger>
        <Tooltip.Content>Callbacks tooltip</Tooltip.Content>
      </Tooltip>
    );

    const trigger = getTrigger(container);

    act(() => {
      trigger?.click();
    });

    act(() => {
      trigger?.focus();
    });

    act(() => {
      trigger?.dispatchEvent(
        new MouseEvent('mouseover', {
          bubbles: true,
        })
      );
    });

    act(() => {
      trigger?.dispatchEvent(
        new MouseEvent('mouseout', {
          bubbles: true,
        })
      );
    });

    act(() => {
      trigger?.blur();
    });

    expect(onPress).toHaveBeenCalled();
    expect(onFocus).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
    expect(onHoverIn).toHaveBeenCalled();
    expect(onHoverOut).toHaveBeenCalled();

    unmount();
  });
});
