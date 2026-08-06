import { act } from 'react';

import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Button } from '../../primitives/Button';
import type * as PortalModule from '../../primitives/Portal';
import { render } from '../../test-utils/render';

import { Popover } from '.';

vi.mock('../../managers/FloatingManager', () => ({
  useNativeFloatingPosition: () => ({
    position: {
      top: 120,
      left: 48,
    },
    updatePosition: vi.fn(),
    onFloatingLayout: vi.fn(),
  }),
}));

let requestClose: (() => void) | undefined;

vi.mock('../../primitives/Portal', async () => {
  const actual = await vi.importActual<typeof PortalModule>(
    '../../primitives/Portal'
  );

  return {
    ...actual,
    Portal: ({
      children,
      onRequestClose,
      visible = true,
    }: {
      children: ReactNode;
      onRequestClose?: () => void;
      visible?: boolean;
    }) => {
      requestClose = onRequestClose;

      return visible ? <>{children}</> : null;
    },
  };
});

afterEach(() => {
  requestClose = undefined;
  vi.clearAllMocks();
});

describe('Native Popover', () => {
  it('opens from Popover.Trigger', () => {
    const { container, unmount } = render(
      <Popover>
        <Popover.Trigger asChild>
          <Button>Open popover</Button>
        </Popover.Trigger>

        <Popover.Content>
          <Popover.Title>Workspace settings</Popover.Title>
          <Popover.Description>
            Configure workspace preferences.
          </Popover.Description>
        </Popover.Content>
      </Popover>
    );

    expect(container.textContent).not.toContain('Workspace settings');

    const trigger = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Open popover');

    act(() => {
      trigger?.click();
    });

    expect(container.textContent).toContain('Workspace settings');
    expect(container.textContent).toContain('Configure workspace preferences.');

    unmount();
  });

  it('closes from Popover.Close', () => {
    const { container, unmount } = render(
      <Popover defaultOpen>
        <Popover.Trigger asChild>
          <Button>Open popover</Button>
        </Popover.Trigger>

        <Popover.Content>
          <Popover.Title>Workspace settings</Popover.Title>

          <Popover.Close asChild>
            <Button>Close popover</Button>
          </Popover.Close>
        </Popover.Content>
      </Popover>
    );

    const close = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Close popover');

    act(() => {
      close?.click();
    });

    expect(container.textContent).not.toContain('Workspace settings');

    unmount();
  });

  it('closes from outside press', () => {
    const onOpenChange = vi.fn();

    const { container, unmount } = render(
      <Popover defaultOpen onOpenChange={onOpenChange}>
        <Popover.Trigger asChild>
          <Button>Open popover</Button>
        </Popover.Trigger>

        <Popover.Content>
          <Text>Popover content</Text>
        </Popover.Content>
      </Popover>
    );

    const backdrop = container.querySelector<HTMLButtonElement>(
      '[aria-label="Close popover"]'
    );

    act(() => {
      backdrop?.click();
    });

    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({
        reason: 'outside-press',
      })
    );

    unmount();
  });

  it('supports controlled open state', () => {
    const onOpenChange = vi.fn();

    const { container, unmount } = render(
      <Popover open={false} onOpenChange={onOpenChange}>
        <Popover.Trigger asChild>
          <Button>Open popover</Button>
        </Popover.Trigger>

        <Popover.Content>
          <Text>Controlled content</Text>
        </Popover.Content>
      </Popover>
    );

    const trigger = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Open popover');

    act(() => {
      trigger?.click();
    });

    expect(onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({
        reason: 'trigger',
      })
    );

    expect(container.textContent).not.toContain('Controlled content');

    unmount();
  });

  it('preserves child press handlers with asChild', () => {
    const onPress = vi.fn();

    const { container, unmount } = render(
      <Popover>
        <Popover.Trigger asChild>
          <Button onPress={onPress}>Open popover</Button>
        </Popover.Trigger>

        <Popover.Content>
          <Text>Popover content</Text>
        </Popover.Content>
      </Popover>
    );

    const trigger = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Open popover');

    act(() => {
      trigger?.click();
    });

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(container.textContent).toContain('Popover content');

    unmount();
  });

  it('renders title and description content', () => {
    const { container, unmount } = render(
      <Popover defaultOpen>
        <Popover.Trigger asChild>
          <Button>Open popover</Button>
        </Popover.Trigger>

        <Popover.Content>
          <Popover.Title>Workspace settings</Popover.Title>
          <Popover.Description>
            Configure workspace preferences.
          </Popover.Description>
        </Popover.Content>
      </Popover>
    );

    expect(container.textContent).toContain('Workspace settings');
    expect(container.textContent).toContain('Configure workspace preferences.');

    unmount();
  });

  it('preserves child press handlers in Popover.Close', () => {
    const onPress = vi.fn();

    const { container, unmount } = render(
      <Popover defaultOpen>
        <Popover.Trigger asChild>
          <Button>Open popover</Button>
        </Popover.Trigger>

        <Popover.Content>
          <Popover.Title>Workspace settings</Popover.Title>

          <Popover.Close asChild>
            <Button onPress={onPress}>Close popover</Button>
          </Popover.Close>
        </Popover.Content>
      </Popover>
    );

    const close = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Close popover');

    act(() => {
      close?.click();
    });

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(container.textContent).not.toContain('Workspace settings');

    unmount();
  });

  it('reports the close reason from Popover.Close', () => {
    const onOpenChange = vi.fn();

    const { container, unmount } = render(
      <Popover defaultOpen onOpenChange={onOpenChange}>
        <Popover.Trigger asChild>
          <Button>Open popover</Button>
        </Popover.Trigger>

        <Popover.Content>
          <Popover.Close asChild>
            <Button>Close popover</Button>
          </Popover.Close>
        </Popover.Content>
      </Popover>
    );

    const close = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Close popover');

    act(() => {
      close?.click();
    });

    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({
        reason: 'close',
      })
    );

    unmount();
  });

  it('applies the calculated floating position to Popover.Content', () => {
    const { container, unmount } = render(
      <Popover defaultOpen>
        <Popover.Trigger asChild>
          <Button>Open popover</Button>
        </Popover.Trigger>

        <Popover.Content testID='popover-content'>
          <Text>Positioned content</Text>
        </Popover.Content>
      </Popover>
    );

    const content = container.querySelector<HTMLElement>(
      '[data-testid="popover-content"]'
    );

    expect(content?.style.top).toBe('120px');
    expect(content?.style.left).toBe('48px');

    unmount();
  });

  it('closes when the native portal requests dismissal', () => {
    const onOpenChange = vi.fn();

    const { unmount } = render(
      <Popover defaultOpen onOpenChange={onOpenChange}>
        <Popover.Trigger asChild>
          <Button>Open popover</Button>
        </Popover.Trigger>

        <Popover.Content>
          <Text>Popover content</Text>
        </Popover.Content>
      </Popover>
    );

    act(() => {
      requestClose?.();
    });

    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({
        reason: 'escape-key',
      })
    );

    unmount();
  });

  it('does not close from outside press when disabled', () => {
    const onOpenChange = vi.fn();

    const { container, unmount } = render(
      <Popover
        defaultOpen
        closeOnOutsidePress={false}
        onOpenChange={onOpenChange}
      >
        <Popover.Trigger asChild>
          <Button>Open popover</Button>
        </Popover.Trigger>

        <Popover.Content>
          <Text>Persistent content</Text>
        </Popover.Content>
      </Popover>
    );

    const backdrop = container.querySelector<HTMLElement>(
      '[data-testid="popover-backdrop"]'
    );

    expect(backdrop).not.toBeNull();

    act(() => {
      backdrop?.click();
    });

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(container.textContent).toContain('Persistent content');

    unmount();
  });

  it('supports a separate positioning anchor', () => {
    const { container, unmount } = render(
      <Popover defaultOpen>
        <Popover.Anchor>
          <View testID='popover-anchor' />
        </Popover.Anchor>

        <Popover.Trigger asChild>
          <Button>Open popover</Button>
        </Popover.Trigger>

        <Popover.Content>
          <Text>Anchored content</Text>
        </Popover.Content>
      </Popover>
    );

    expect(
      container.querySelector('[data-testid="popover-anchor"]')
    ).not.toBeNull();

    expect(container.textContent).toContain('Anchored content');

    unmount();
  });
});
