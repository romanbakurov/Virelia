import { act } from 'react';

import { Text } from 'react-native';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Button } from '../../primitives/Button';
import { Portal } from '../../primitives/Portal';
import { render } from '../../test-utils/render';
import { nativeThemes, ThemeProvider } from '../../theme';

import { Modal } from '.';

afterEach(() => {
  document.body.innerHTML = '';
});

const toCssRgb = (hex: string) => {
  const value = hex.replace('#', '');
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);

  return `rgb(${red}, ${green}, ${blue})`;
};

function NativeModal({
  open = true,
  onOpenChange = () => undefined,
  closeOnOutsidePress,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnOutsidePress?: boolean;
}) {
  return (
    <Modal
      open={open}
      closeOnOutsidePress={closeOnOutsidePress}
      onOpenChange={onOpenChange}
    >
      <Portal>
        <Modal.Overlay>
          <Modal.Content>
            <Modal.Header>Native modal</Modal.Header>
            <Modal.Body>
              <Text>Body content</Text>
            </Modal.Body>
            <Modal.Footer>
              <Modal.Close>
                <Button>Done</Button>
              </Modal.Close>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Overlay>
      </Portal>
    </Modal>
  );
}

describe('Native Modal', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(
      (callback) => {
        callback(0);
        return 1;
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders modal content when open', () => {
    const { container, unmount } = render(<NativeModal />);

    expect(container.textContent).toContain('Native modal');
    expect(container.textContent).toContain('Body content');

    unmount();
  });

  it.each([
    ['dark', nativeThemes.dark.components.modal.content.fg],
    ['highContrast', nativeThemes.highContrast.components.modal.content.fg],
  ] as const)(
    'uses readable text colors in the %s theme',
    (themeName, expectedColor) => {
      const { container, unmount } = render(
        <ThemeProvider defaultTheme={themeName}>
          <NativeModal />
        </ThemeProvider>
      );

      const modalText = Array.from(container.querySelectorAll('span')).find(
        (element) => element.textContent === 'Body content'
      );

      expect(modalText?.style.color).toBe(toCssRgb(expectedColor));

      unmount();
    }
  );

  it.each([
    ['dark', nativeThemes.dark.components.modal.content],
    ['highContrast', nativeThemes.highContrast.components.modal.content],
  ] as const)(
    'uses modal content surface tokens in the %s theme',
    (themeName, contentTokens) => {
      const { container, unmount } = render(
        <ThemeProvider defaultTheme={themeName}>
          <NativeModal />
        </ThemeProvider>
      );

      const content = Array.from(container.querySelectorAll('div')).find(
        (element) =>
          element.style.backgroundColor === toCssRgb(contentTokens.bg)
      );

      expect(content?.style.borderColor).toBe(toCssRgb(contentTokens.border));
      expect(content?.style.borderRadius).toBe(`${contentTokens.radius}px`);

      unmount();
    }
  );

  it('does not render modal content when closed', () => {
    const { container, unmount } = render(<NativeModal open={false} />);

    expect(container.textContent).not.toContain('Native modal');
    expect(container.textContent).not.toContain('Body content');

    unmount();
  });

  it('opens from Trigger asChild', () => {
    const { container, unmount } = render(
      <Modal>
        <Modal.Trigger asChild>
          <Button>Open modal</Button>
        </Modal.Trigger>
        <Portal>
          <Modal.Overlay>
            <Modal.Content>
              <Modal.Header>Native modal</Modal.Header>
            </Modal.Content>
          </Modal.Overlay>
        </Portal>
      </Modal>
    );

    expect(container.textContent).not.toContain('Native modal');

    const trigger = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Open modal');

    act(() => trigger?.click());

    expect(container.textContent).toContain('Native modal');

    unmount();
  });

  it('calls onOpenChange when backdrop is pressed', () => {
    const onOpenChange = vi.fn();
    const { container, unmount } = render(
      <NativeModal onOpenChange={onOpenChange} />
    );

    const backdrop = container.querySelector<HTMLButtonElement>(
      '[data-testid="modal-backdrop"]'
    );

    act(() => backdrop?.click());

    expect(onOpenChange).toHaveBeenCalledWith(false);

    unmount();
  });

  it('calls onOpenChange from Modal.Close and keeps controls focusable', () => {
    const onOpenChange = vi.fn();
    const { container, unmount } = render(
      <NativeModal onOpenChange={onOpenChange} />
    );

    const closeButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Close modal"]'
    );
    const doneButton = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Done');

    act(() => {
      closeButton?.focus();
    });

    expect(document.activeElement).toBe(closeButton);

    act(() => {
      doneButton?.focus();
    });

    expect(document.activeElement).toBe(doneButton);

    act(() => {
      closeButton?.click();
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);

    unmount();
  });

  it('does not expose backdrop as close button when outside close is disabled', () => {
    const onOpenChange = vi.fn();
    const { container, unmount } = render(
      <NativeModal closeOnOutsidePress={false} onOpenChange={onOpenChange} />
    );

    const backdrop = container.querySelector<HTMLButtonElement>(
      '[data-testid="modal-backdrop"]'
    );

    expect(backdrop).not.toBeNull();
    expect(backdrop?.getAttribute('role')).toBeNull();
    expect(backdrop?.getAttribute('aria-label')).toBeNull();

    act(() => {
      backdrop?.click();
    });

    expect(onOpenChange).not.toHaveBeenCalled();

    unmount();
  });

  it('restores focus to the trigger after Modal.Close', () => {
    const animationFrame = vi
      .spyOn(globalThis, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        callback(0);
        return 1;
      });

    const { container, unmount } = render(
      <Modal>
        <Modal.Trigger asChild>
          <Button>Open modal</Button>
        </Modal.Trigger>

        <Portal>
          <Modal.Overlay>
            <Modal.Content>
              <Modal.Close>
                <Button>Done</Button>
              </Modal.Close>
            </Modal.Content>
          </Modal.Overlay>
        </Portal>
      </Modal>
    );

    const trigger = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Open modal');

    act(() => {
      trigger?.click();
    });

    const doneButton = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Done');

    act(() => {
      doneButton?.click();
    });

    expect(animationFrame).toHaveBeenCalled();
    expect(document.activeElement).toBe(trigger);

    unmount();
    animationFrame.mockRestore();
  });

  it('restores focus to the trigger after backdrop dismissal', () => {
    const animationFrame = vi
      .spyOn(globalThis, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        callback(0);
        return 1;
      });

    const { container, unmount } = render(
      <Modal>
        <Modal.Trigger asChild>
          <Button>Open modal</Button>
        </Modal.Trigger>

        <Portal>
          <Modal.Overlay>
            <Modal.Content>
              <Text>Modal content</Text>
            </Modal.Content>
          </Modal.Overlay>
        </Portal>
      </Modal>
    );

    const trigger = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Open modal');

    act(() => {
      trigger?.click();
    });

    const backdrop = container.querySelector<HTMLButtonElement>(
      '[data-testid="modal-backdrop"]'
    );

    act(() => {
      backdrop?.click();
    });

    expect(animationFrame).toHaveBeenCalled();
    expect(document.activeElement).toBe(trigger);

    unmount();
    animationFrame.mockRestore();
  });

  it('does not restore focus until a controlled modal actually closes', () => {
    const onOpenChange = vi.fn();

    const { container, rerender, unmount } = render(
      <Modal open onOpenChange={onOpenChange}>
        <Modal.Trigger asChild>
          <Button>Open modal</Button>
        </Modal.Trigger>

        <Portal>
          <Modal.Overlay>
            <Modal.Content>
              <Modal.Close>
                <Button>Done</Button>
              </Modal.Close>
            </Modal.Content>
          </Modal.Overlay>
        </Portal>
      </Modal>
    );

    const trigger = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Open modal');

    const doneButton = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Done');

    act(() => {
      doneButton?.click();
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(document.activeElement).not.toBe(trigger);

    rerender(
      <Modal open={false} onOpenChange={onOpenChange}>
        <Modal.Trigger asChild>
          <Button>Open modal</Button>
        </Modal.Trigger>

        <Portal>
          <Modal.Overlay>
            <Modal.Content>
              <Modal.Close>
                <Button>Done</Button>
              </Modal.Close>
            </Modal.Content>
          </Modal.Overlay>
        </Portal>
      </Modal>
    );

    expect(document.activeElement).toBe(trigger);

    unmount();
  });
});
