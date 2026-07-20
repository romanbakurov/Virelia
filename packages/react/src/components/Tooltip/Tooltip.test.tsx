import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { Portal } from '../../primitives/Portal';
import { render } from '../../test-utils/render';

import { Tooltip } from './Tooltip';

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
});

describe('Tooltip', () => {
  it('opens compound content with placement metadata', () => {
    vi.useFakeTimers();

    const { container, unmount } = render(
      <Tooltip delay={0} placement='top-start'>
        <Tooltip.Trigger>Trigger</Tooltip.Trigger>
        <Portal>
          <Tooltip.Content style={{ maxWidth: '18rem' }}>
            Helpful text
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Portal>
      </Tooltip>
    );

    const trigger = container.querySelector('button');

    act(() => {
      trigger?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      vi.advanceTimersByTime(0);
    });

    const tooltip = document.querySelector('[role="tooltip"]');
    const arrow = tooltip?.querySelector<HTMLDivElement>('div');

    expect(trigger?.getAttribute('aria-describedby')).toBe(tooltip?.id);
    expect(tooltip?.getAttribute('data-placement')).toBe('top-start');
    expect(tooltip?.getAttribute('data-state')).toBe('open');
    expect(tooltip?.textContent).toContain('Helpful text');
    expect(tooltip?.style.maxWidth).toBe('18rem');
    expect(arrow?.style.bottom).toBe('-5px');

    unmount();
  });

  it('does not open when disabled', () => {
    const { container, unmount } = render(
      <Tooltip disabled delay={0}>
        <Tooltip.Trigger>Trigger</Tooltip.Trigger>
        <Portal>
          <Tooltip.Content>Disabled tooltip</Tooltip.Content>
        </Portal>
      </Tooltip>
    );

    const trigger = container.querySelector('button');

    act(() => {
      trigger?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    });

    expect(document.body.textContent).not.toContain('Disabled tooltip');

    unmount();
  });

  it('supports controlled open state', () => {
    const onOpenChange = vi.fn();
    const { rerender, unmount } = render(
      <Tooltip open={false} onOpenChange={onOpenChange}>
        <Tooltip.Trigger>Trigger</Tooltip.Trigger>
        <Portal>
          <Tooltip.Content>Controlled tooltip</Tooltip.Content>
        </Portal>
      </Tooltip>
    );

    expect(document.body.textContent).not.toContain('Controlled tooltip');

    rerender(
      <Tooltip open onOpenChange={onOpenChange}>
        <Tooltip.Trigger>Trigger</Tooltip.Trigger>
        <Portal>
          <Tooltip.Content>Controlled tooltip</Tooltip.Content>
        </Portal>
      </Tooltip>
    );

    expect(document.body.textContent).toContain('Controlled tooltip');

    unmount();
  });

  it('supports Trigger asChild without rendering an extra button', () => {
    vi.useFakeTimers();
    const onPointerEnter = vi.fn();

    const { container, unmount } = render(
      <Tooltip delay={0}>
        <Tooltip.Trigger asChild>
          <button
            type='button'
            className='custom'
            onPointerEnter={onPointerEnter}
          >
            Trigger
          </button>
        </Tooltip.Trigger>
        <Portal>
          <Tooltip.Content>asChild tooltip</Tooltip.Content>
        </Portal>
      </Tooltip>
    );

    const buttons = container.querySelectorAll('button');

    act(() => {
      buttons[0]?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      buttons[0]?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      vi.advanceTimersByTime(0);
    });

    expect(buttons).toHaveLength(1);
    expect(buttons[0].className).toContain('custom');
    expect(onPointerEnter).toHaveBeenCalled();
    expect(document.body.textContent).toContain('asChild tooltip');

    unmount();
  });

  it('opens from focus', () => {
    const { container, unmount } = render(
      <Tooltip delay={0}>
        <Tooltip.Trigger>Trigger</Tooltip.Trigger>
        <Portal>
          <Tooltip.Content>Focused tooltip</Tooltip.Content>
        </Portal>
      </Tooltip>
    );

    const trigger = container.querySelector('button');

    act(() => {
      trigger?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    });

    expect(document.body.textContent).toContain('Focused tooltip');

    unmount();
  });

  it('keeps content mounted when forceMount is enabled', () => {
    const { unmount } = render(
      <Tooltip open={false}>
        <Tooltip.Trigger>Trigger</Tooltip.Trigger>
        <Portal>
          <Tooltip.Content forceMount>Force mounted tooltip</Tooltip.Content>
        </Portal>
      </Tooltip>
    );

    const tooltip = document.querySelector('[role="tooltip"]');

    expect(tooltip?.textContent).toContain('Force mounted tooltip');
    expect(tooltip?.getAttribute('data-state')).toBe('closed');

    unmount();
  });

  it('uses provider delay when root delay is not provided', () => {
    vi.useFakeTimers();

    const { container, unmount } = render(
      <Tooltip.Provider delay={200}>
        <Tooltip>
          <Tooltip.Trigger>Trigger</Tooltip.Trigger>
          <Portal>
            <Tooltip.Content>Provider tooltip</Tooltip.Content>
          </Portal>
        </Tooltip>
      </Tooltip.Provider>
    );

    const trigger = container.querySelector('button');

    act(() => {
      trigger?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      vi.advanceTimersByTime(199);
    });

    expect(document.body.textContent).not.toContain('Provider tooltip');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(document.body.textContent).toContain('Provider tooltip');

    unmount();
  });
});
