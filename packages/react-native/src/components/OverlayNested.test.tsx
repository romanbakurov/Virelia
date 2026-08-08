import { act, useEffect, useState } from 'react';

import { Platform, Text } from 'react-native';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { nativeOverlayManager } from '../managers';
import type * as FloatingManagerModule from '../managers/FloatingManager';
import { Button } from '../primitives/Button';
import { Portal } from '../primitives/Portal';
import { render } from '../test-utils/render';

import { Dropdown } from './Dropdown';
import { Modal } from './Modal';
import { Popover } from './Popover';
import { Select } from './Select';
import { Tooltip } from './Tooltip';

const originalOS = Platform.OS;

vi.mock('../managers/FloatingManager', async () => {
  const actual = await vi.importActual<typeof FloatingManagerModule>(
    '../managers/FloatingManager'
  );

  return {
    ...actual,
    useNativeFloatingPosition: () => ({
      position: {
        top: 120,
        left: 48,
      },
      arrowPosition: {
        left: 24,
      },
      placement: 'top',
      updatePosition: vi.fn(),
      onFloatingLayout: vi.fn(),
    }),
  };
});

function dismissTopOverlay() {
  act(() => {
    nativeOverlayManager.dispatchTopDismiss();
  });
}

async function flushOverlayEffects() {
  await act(async () => undefined);
}

function OpenSelectAfterMount() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Select
      label='Country'
      open={open}
      onOpenChange={setOpen}
      presentation='modal'
      options={[
        { label: 'France', value: 'fr' },
        { label: 'Germany', value: 'de' },
      ]}
    />
  );
}

function OpenTooltipAfterMount() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <Tooltip.Trigger>
        <Text>Info</Text>
      </Tooltip.Trigger>
      <Tooltip.Content>Helpful detail</Tooltip.Content>
    </Tooltip>
  );
}

beforeEach(() => {
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    value: 'web',
  });

  vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(
    (callback) => {
      callback(0);
      return 1;
    }
  );
});

afterEach(() => {
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    value: originalOS,
  });

  nativeOverlayManager.clear();
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('Native nested overlays', () => {
  it('closes only a dropdown nested in a modal on topmost dismissal', async () => {
    const onModalOpenChange = vi.fn();

    const { container, unmount } = render(
      <Modal open onOpenChange={onModalOpenChange}>
        <Portal>
          <Modal.Overlay>
            <Modal.Content>
              <Modal.Header>Account settings</Modal.Header>
              <Dropdown label='Actions'>
                <Dropdown.Trigger>Actions</Dropdown.Trigger>
                <Dropdown.Content>
                  <Dropdown.Item value='edit'>Edit</Dropdown.Item>
                </Dropdown.Content>
              </Dropdown>
            </Modal.Content>
          </Modal.Overlay>
        </Portal>
      </Modal>
    );

    expect(container.textContent).toContain('Account settings');

    const trigger = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('Actions')
    );

    act(() => {
      trigger?.click();
    });
    await flushOverlayEffects();

    expect(container.querySelector('[role="menu"]')).not.toBeNull();

    dismissTopOverlay();

    expect(container.querySelector('[role="menu"]')).toBeNull();
    expect(container.textContent).toContain('Account settings');
    expect(onModalOpenChange).not.toHaveBeenCalled();

    unmount();
  });

  it('closes only a popover nested in a modal on topmost dismissal', async () => {
    const onModalOpenChange = vi.fn();

    const { container, unmount } = render(
      <Modal open onOpenChange={onModalOpenChange}>
        <Portal>
          <Modal.Overlay>
            <Modal.Content>
              <Modal.Header>Workspace settings</Modal.Header>
              <Popover>
                <Popover.Trigger asChild>
                  <Button>Open help</Button>
                </Popover.Trigger>
                <Popover.Content>
                  <Popover.Title>Help</Popover.Title>
                  <Popover.Description>
                    Nested help content.
                  </Popover.Description>
                </Popover.Content>
              </Popover>
            </Modal.Content>
          </Modal.Overlay>
        </Portal>
      </Modal>
    );

    expect(document.body.textContent).toContain('Workspace settings');

    const trigger = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('Open help')
    );

    act(() => {
      trigger?.click();
    });
    await flushOverlayEffects();

    expect(document.body.textContent).toContain('Nested help content.');

    dismissTopOverlay();

    expect(document.body.textContent).not.toContain('Nested help content.');
    expect(document.body.textContent).toContain('Workspace settings');
    expect(onModalOpenChange).not.toHaveBeenCalled();

    unmount();
  });

  it('closes only a select nested in a modal on topmost dismissal', async () => {
    const onModalOpenChange = vi.fn();

    const { container, unmount } = render(
      <Modal open onOpenChange={onModalOpenChange}>
        <Portal>
          <Modal.Overlay>
            <Modal.Content>
              <Modal.Header>Profile settings</Modal.Header>
              <OpenSelectAfterMount />
            </Modal.Content>
          </Modal.Overlay>
        </Portal>
      </Modal>
    );

    await flushOverlayEffects();

    expect(
      document.body.querySelector('[data-testid="select-content-root"]')
    ).not.toBeNull();

    dismissTopOverlay();

    expect(
      document.body.querySelector('[data-testid="select-content-root"]')
    ).toBeNull();
    expect(container.textContent).toContain('Profile settings');
    expect(onModalOpenChange).not.toHaveBeenCalled();

    unmount();
  });

  it('closes only a tooltip nested in a popover on topmost dismissal', async () => {
    const { unmount } = render(
      <Popover defaultOpen>
        <Popover.Trigger asChild>
          <Button>Open popover</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Title>Details</Popover.Title>
          <Popover.Description>Nested tooltip host.</Popover.Description>
          <OpenTooltipAfterMount />
        </Popover.Content>
      </Popover>
    );

    await flushOverlayEffects();

    expect(document.body.textContent).toContain('Helpful detail');

    dismissTopOverlay();

    expect(document.body.textContent).not.toContain('Helpful detail');
    expect(document.body.textContent).toContain('Nested tooltip host.');

    unmount();
  });
});
