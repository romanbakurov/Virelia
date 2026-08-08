import { act, createRef } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectNoA11yViolations } from '../../test-utils/a11y';
import { render } from '../../test-utils/render';

import { Popover } from './Popover';

afterEach(() => {
  document.body.innerHTML = '';
  document.body.style.overflow = '';
});

function pressDocumentKey(key: string) {
  act(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key }));
  });
}

function pressOutside() {
  act(() => {
    document.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
      })
    );
  });
}

const textById = (id: string | null | undefined) =>
  id ? document.getElementById(id)?.textContent : undefined;

describe('Popover', () => {
  it('opens from the trigger and closes through Popover.Close', () => {
    const { container, unmount } = render(
      <Popover>
        <Popover.Trigger>Open popover</Popover.Trigger>

        <Popover.Content>
          <Popover.Title>Workspace settings</Popover.Title>

          <Popover.Description>Configure your workspace.</Popover.Description>

          <Popover.Close>Close</Popover.Close>
        </Popover.Content>
      </Popover>
    );

    expect(document.querySelector('[role="dialog"]')).toBeNull();

    const trigger = container.querySelector<HTMLButtonElement>('button');

    act(() => {
      trigger?.click();
    });

    const dialog = document.querySelector('[role="dialog"]');

    expect(dialog).not.toBeNull();
    expect(dialog?.textContent).toContain('Workspace settings');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');

    const closeButton = Array.from(
      document.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Close');

    act(() => {
      closeButton?.click();
    });

    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');

    unmount();
  });

  it('supports Trigger asChild without rendering an extra button', () => {
    const { container, unmount } = render(
      <Popover>
        <Popover.Trigger asChild>
          <button type='button' className='custom-trigger'>
            Open popover
          </button>
        </Popover.Trigger>

        <Popover.Content>
          <Popover.Title>Workspace settings</Popover.Title>
          <Popover.Description>Configure your workspace.</Popover.Description>
        </Popover.Content>
      </Popover>
    );

    const buttons = container.querySelectorAll('button');
    const trigger = buttons[0];

    expect(buttons).toHaveLength(1);
    expect(trigger?.className).toContain('custom-trigger');

    act(() => {
      trigger?.click();
    });

    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');

    unmount();
  });

  it('supports controlled open state', () => {
    const onOpenChange = vi.fn();

    const { container, rerender, unmount } = render(
      <Popover open={false} onOpenChange={onOpenChange}>
        <Popover.Trigger>Open popover</Popover.Trigger>

        <Popover.Content>
          <Popover.Title>Workspace settings</Popover.Title>
          <Popover.Description>Configure your workspace.</Popover.Description>
        </Popover.Content>
      </Popover>
    );

    const trigger = container.querySelector<HTMLButtonElement>('button');

    act(() => {
      trigger?.click();
    });

    expect(onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({
        reason: 'trigger',
        event: expect.any(PointerEvent),
      })
    );

    expect(document.querySelector('[role="dialog"]')).toBeNull();

    rerender(
      <Popover open onOpenChange={onOpenChange}>
        <Popover.Trigger>Open popover</Popover.Trigger>

        <Popover.Content>
          <Popover.Title>Workspace settings</Popover.Title>
          <Popover.Description>Configure your workspace.</Popover.Description>
        </Popover.Content>
      </Popover>
    );

    expect(document.querySelector('[role="dialog"]')).not.toBeNull();

    unmount();
  });

  it('closes through Popover.Close and reports the close reason', () => {
    const onOpenChange = vi.fn();

    const { unmount } = render(
      <Popover defaultOpen onOpenChange={onOpenChange}>
        <Popover.Trigger>Open popover</Popover.Trigger>

        <Popover.Content>
          <Popover.Title>Workspace settings</Popover.Title>
          <Popover.Description>Configure your workspace.</Popover.Description>

          <Popover.Close>Close</Popover.Close>
        </Popover.Content>
      </Popover>
    );

    expect(document.querySelector('[role="dialog"]')).not.toBeNull();

    const closeButton = Array.from(
      document.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Close');

    act(() => {
      closeButton?.click();
    });

    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({
        reason: 'close',
        event: expect.any(MouseEvent),
      })
    );

    expect(document.querySelector('[role="dialog"]')).toBeNull();

    unmount();
  });

  it('closes on Escape and restores focus to the trigger', async () => {
    const onOpenChange = vi.fn();

    const { container, unmount } = render(
      <Popover defaultOpen onOpenChange={onOpenChange}>
        <Popover.Trigger>Open popover</Popover.Trigger>

        <Popover.Content>
          <Popover.Title>Workspace settings</Popover.Title>
          <Popover.Description>Configure your workspace.</Popover.Description>

          <button type='button'>Focusable action</button>
        </Popover.Content>
      </Popover>
    );

    const trigger = container.querySelector<HTMLButtonElement>('button');

    trigger?.focus();

    pressDocumentKey('Escape');

    await new Promise((resolve) => queueMicrotask(resolve));

    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({
        reason: 'escape-key',
        event: expect.any(KeyboardEvent),
      })
    );

    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);

    unmount();
  });

  it('closes on outside press and reports the outside-press reason', () => {
    const onOpenChange = vi.fn();

    const { unmount } = render(
      <Popover defaultOpen onOpenChange={onOpenChange}>
        <Popover.Trigger>Open popover</Popover.Trigger>

        <Popover.Content>
          <Popover.Title>Workspace settings</Popover.Title>
          <Popover.Description>Configure your workspace.</Popover.Description>
        </Popover.Content>
      </Popover>
    );

    expect(document.querySelector('[role="dialog"]')).not.toBeNull();

    pressOutside();

    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({
        reason: 'outside-press',
        event: expect.any(PointerEvent),
      })
    );

    expect(document.querySelector('[role="dialog"]')).toBeNull();

    unmount();
  });

  it('closes only the topmost popover on outside press', () => {
    const onOuterOpenChange = vi.fn();
    const onInnerOpenChange = vi.fn();

    const { unmount } = render(
      <>
        <Popover defaultOpen onOpenChange={onOuterOpenChange}>
          <Popover.Trigger>Open outer popover</Popover.Trigger>

          <Popover.Content>
            <Popover.Title>Outer settings</Popover.Title>
            <Popover.Description>Configure outer scope.</Popover.Description>
          </Popover.Content>
        </Popover>

        <Popover defaultOpen onOpenChange={onInnerOpenChange}>
          <Popover.Trigger>Open inner popover</Popover.Trigger>

          <Popover.Content>
            <Popover.Title>Inner settings</Popover.Title>
            <Popover.Description>Configure inner scope.</Popover.Description>
          </Popover.Content>
        </Popover>
      </>
    );

    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(2);

    pressOutside();

    expect(onInnerOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({
        reason: 'outside-press',
        event: expect.any(PointerEvent),
      })
    );
    expect(onOuterOpenChange).not.toHaveBeenCalled();
    expect(document.body.textContent).toContain('Outer settings');
    expect(document.body.textContent).not.toContain('Inner settings');

    unmount();
  });

  it('keeps the popover open when outside press is prevented', () => {
    const onOpenChange = vi.fn();
    const onPointerDownOutside = vi.fn((event) => {
      event.preventDefault();
    });

    const { unmount } = render(
      <Popover defaultOpen onOpenChange={onOpenChange}>
        <Popover.Trigger>Open popover</Popover.Trigger>

        <Popover.Content onPointerDownOutside={onPointerDownOutside}>
          <Popover.Title>Workspace settings</Popover.Title>
          <Popover.Description>Configure your workspace.</Popover.Description>
        </Popover.Content>
      </Popover>
    );

    pressOutside();

    expect(onPointerDownOutside).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();

    unmount();
  });

  it('does not close from outside press on trigger or anchor refs', () => {
    const onOpenChange = vi.fn();

    const { container, unmount } = render(
      <Popover defaultOpen onOpenChange={onOpenChange}>
        <Popover.Anchor asChild>
          <button type='button'>Anchor target</button>
        </Popover.Anchor>

        <Popover.Trigger>Open popover</Popover.Trigger>

        <Popover.Content>
          <Popover.Title>Workspace settings</Popover.Title>
          <Popover.Description>Configure your workspace.</Popover.Description>
        </Popover.Content>
      </Popover>
    );

    const anchor = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Anchor target');
    const trigger = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Open popover');

    act(() => {
      anchor?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      trigger?.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true })
      );
    });

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();

    unmount();
  });

  it('connects title and description for accessibility', async () => {
    const { unmount } = render(
      <Popover defaultOpen>
        <Popover.Trigger>Open popover</Popover.Trigger>

        <Popover.Content>
          <Popover.Title>Workspace settings</Popover.Title>

          <Popover.Description>Configure your workspace.</Popover.Description>
        </Popover.Content>
      </Popover>
    );

    await expectNoA11yViolations(document.body);

    const dialog = document.querySelector('[role="dialog"]');
    const titleId = dialog?.getAttribute('aria-labelledby');
    const descriptionId = dialog?.getAttribute('aria-describedby');

    expect(titleId).toBeTruthy();
    expect(descriptionId).toBeTruthy();
    expect(textById(titleId)).toBe('Workspace settings');
    expect(textById(descriptionId)).toBe('Configure your workspace.');

    unmount();
  });

  it('traps focus and locks body scroll in modal mode', async () => {
    const { container, unmount } = render(
      <Popover defaultOpen modal>
        <Popover.Trigger>Open popover</Popover.Trigger>

        <Popover.Content>
          <Popover.Title>Workspace settings</Popover.Title>
          <Popover.Description>Configure your workspace.</Popover.Description>

          <button type='button'>First action</button>
          <button type='button'>Second action</button>
        </Popover.Content>
      </Popover>
    );

    await new Promise((resolve) => queueMicrotask(resolve));

    const trigger = container.querySelector<HTMLButtonElement>('button');
    const actions = document.querySelectorAll<HTMLButtonElement>(
      '[role="dialog"] button'
    );

    const firstAction = actions[0];
    const secondAction = actions[1];

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.activeElement).toBe(firstAction);

    secondAction?.focus();

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          bubbles: true,
        })
      );
    });

    expect(document.activeElement).toBe(firstAction);

    firstAction?.focus();

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey: true,
          bubbles: true,
        })
      );
    });

    expect(document.activeElement).toBe(secondAction);

    unmount();

    expect(document.body.style.overflow).toBe('');
    expect(trigger).not.toBeNull();
  });

  it('supports initialFocus and can disable focus restoration', async () => {
    const initialFocusRef = createRef<HTMLButtonElement>();

    const { container, unmount } = render(
      <Popover defaultOpen>
        <Popover.Trigger>Open popover</Popover.Trigger>

        <Popover.Content initialFocus={initialFocusRef} returnFocus={false}>
          <Popover.Title>Workspace settings</Popover.Title>

          <Popover.Description>Configure your workspace.</Popover.Description>

          <button type='button'>First action</button>

          <button ref={initialFocusRef} type='button'>
            Preferred action
          </button>
        </Popover.Content>
      </Popover>
    );

    const trigger = container.querySelector<HTMLButtonElement>('button');

    await new Promise((resolve) => queueMicrotask(resolve));

    expect(document.activeElement).toBe(initialFocusRef.current);

    pressDocumentKey('Escape');

    await new Promise((resolve) => queueMicrotask(resolve));

    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).not.toBe(trigger);

    unmount();
  });

  it('does not close on Escape or outside press when disabled', () => {
    const onOpenChange = vi.fn();

    const { unmount } = render(
      <Popover defaultOpen onOpenChange={onOpenChange}>
        <Popover.Trigger>Open popover</Popover.Trigger>

        <Popover.Content closeOnEscape={false} closeOnOutsidePress={false}>
          <Popover.Title>Workspace settings</Popover.Title>

          <Popover.Description>Configure your workspace.</Popover.Description>
        </Popover.Content>
      </Popover>
    );

    pressDocumentKey('Escape');
    pressOutside();

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();

    unmount();
  });

  it('supports Close asChild and preserves the child click handler', () => {
    const onClick = vi.fn();
    const onOpenChange = vi.fn();

    const { unmount } = render(
      <Popover defaultOpen onOpenChange={onOpenChange}>
        <Popover.Trigger>Open popover</Popover.Trigger>

        <Popover.Content>
          <Popover.Title>Workspace settings</Popover.Title>
          <Popover.Description>Configure your workspace.</Popover.Description>

          <Popover.Close asChild>
            <button type='button' className='custom-close' onClick={onClick}>
              Dismiss
            </button>
          </Popover.Close>
        </Popover.Content>
      </Popover>
    );

    const dialog = document.querySelector('[role="dialog"]');
    const closeButton =
      dialog?.querySelector<HTMLButtonElement>('.custom-close');

    expect(dialog?.querySelectorAll('button')).toHaveLength(1);

    act(() => {
      closeButton?.click();
    });

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({
        reason: 'close',
        event: expect.any(MouseEvent),
      })
    );
    expect(document.querySelector('[role="dialog"]')).toBeNull();

    unmount();
  });

  it('keeps the popover open when Close click is prevented', () => {
    const onOpenChange = vi.fn();
    const onClick = vi.fn((event) => {
      event.preventDefault();
    });

    const { unmount } = render(
      <Popover defaultOpen onOpenChange={onOpenChange}>
        <Popover.Trigger>Open popover</Popover.Trigger>

        <Popover.Content>
          <Popover.Title>Workspace settings</Popover.Title>

          <Popover.Description>Configure your workspace.</Popover.Description>

          <Popover.Close asChild>
            <button type='button' onClick={onClick}>
              Keep open
            </button>
          </Popover.Close>
        </Popover.Content>
      </Popover>
    );

    const closeButton = Array.from(
      document.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Keep open');

    act(() => {
      closeButton?.click();
    });

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();

    unmount();
  });

  it('supports a separate Anchor while keeping Trigger behavior', async () => {
    const { container, unmount } = render(
      <Popover>
        <Popover.Anchor asChild>
          <div data-testid='popover-anchor'>Position relative to me</div>
        </Popover.Anchor>

        <Popover.Trigger asChild>
          <button type='button'>Toggle popover</button>
        </Popover.Trigger>

        <Popover.Content>
          <Popover.Title>Separate anchor</Popover.Title>

          <Popover.Description>
            Positioned relative to the anchor.
          </Popover.Description>
        </Popover.Content>
      </Popover>
    );

    const anchor = container.querySelector<HTMLElement>(
      '[data-testid="popover-anchor"]'
    );
    const trigger = container.querySelector<HTMLButtonElement>('button');

    expect(anchor).not.toBeNull();
    expect(
      container.querySelectorAll('[data-testid="popover-anchor"]')
    ).toHaveLength(1);
    expect(document.querySelector('[role="dialog"]')).toBeNull();

    act(() => {
      trigger?.click();
    });

    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');

    trigger?.focus();
    pressDocumentKey('Escape');

    await new Promise((resolve) => queueMicrotask(resolve));

    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);

    unmount();
  });

  it('supports a separate Anchor while keeping Trigger behavior', async () => {
    const { container, unmount } = render(
      <Popover>
        <Popover.Anchor asChild>
          <div data-testid='popover-anchor'>Position relative to me</div>
        </Popover.Anchor>

        <Popover.Trigger asChild>
          <button type='button'>Toggle popover</button>
        </Popover.Trigger>

        <Popover.Content>
          <Popover.Title>Separate anchor</Popover.Title>

          <Popover.Description>
            Positioned relative to the anchor.
          </Popover.Description>
        </Popover.Content>
      </Popover>
    );

    const anchor = container.querySelector<HTMLElement>(
      '[data-testid="popover-anchor"]'
    );
    const trigger = container.querySelector<HTMLButtonElement>('button');

    expect(anchor).not.toBeNull();
    expect(
      container.querySelectorAll('[data-testid="popover-anchor"]')
    ).toHaveLength(1);
    expect(document.querySelector('[role="dialog"]')).toBeNull();

    act(() => {
      trigger?.click();
    });

    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');

    trigger?.focus();
    pressDocumentKey('Escape');

    await new Promise((resolve) => queueMicrotask(resolve));

    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);

    unmount();
  });

  it('renders Popover.Arrow with custom alignment and styling props', () => {
    const { unmount } = render(
      <Popover defaultOpen side='top'>
        <Popover.Trigger>Open popover</Popover.Trigger>

        <Popover.Content>
          <Popover.Arrow
            align='start'
            offset={24}
            width={16}
            height={8}
            strokeWidth={2}
            className='custom-arrow'
          />

          <Popover.Title>Workspace settings</Popover.Title>

          <Popover.Description>Configure your workspace.</Popover.Description>
        </Popover.Content>
      </Popover>
    );

    const arrow = document.querySelector<SVGSVGElement>('svg.custom-arrow');

    expect(arrow).not.toBeNull();
    expect(arrow?.getAttribute('data-side')).toBe('top');
    expect(arrow?.className.baseVal).toContain('custom-arrow');

    unmount();
  });

  it('renders content inline when portal is disabled', () => {
    const { container, unmount } = render(
      <Popover defaultOpen portal={false}>
        <Popover.Trigger>Open popover</Popover.Trigger>

        <Popover.Content>
          <Popover.Title>Inline popover</Popover.Title>

          <Popover.Description>Rendered without a portal.</Popover.Description>
        </Popover.Content>
      </Popover>
    );

    const dialog = container.querySelector('[role="dialog"]');

    expect(dialog).not.toBeNull();
    expect(document.body.querySelector('[role="dialog"]')).toBe(dialog);
    expect(dialog?.textContent).toContain('Inline popover');

    unmount();
  });
});
