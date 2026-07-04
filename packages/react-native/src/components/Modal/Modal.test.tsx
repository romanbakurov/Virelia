import { act } from 'react';

import { Text } from 'react-native';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Button } from '../../primitives/Button';
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

describe('Native Modal', () => {
  it('renders modal content when open', () => {
    const { container, unmount } = render(
      <Modal isOpen onClose={() => undefined}>
        <Modal.Header>Native modal</Modal.Header>
        <Modal.Body>Body content</Modal.Body>
      </Modal>
    );

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
          <Modal isOpen onClose={() => undefined}>
            <Modal.Header>Native modal</Modal.Header>
            <Modal.Body>
              <Text>Body content</Text>
            </Modal.Body>
          </Modal>
        </ThemeProvider>
      );

      const modalText = Array.from(container.querySelectorAll('span')).find(
        (element) => element.textContent === 'Body content'
      );

      expect(modalText?.style.color).toBe(toCssRgb(expectedColor));

      unmount();
    }
  );

  it('does not render modal content when closed', () => {
    const { container, unmount } = render(
      <Modal isOpen={false} onClose={() => undefined}>
        <Modal.Header>Native modal</Modal.Header>
        <Modal.Body>Body content</Modal.Body>
      </Modal>
    );

    expect(container.textContent).not.toContain('Native modal');
    expect(container.querySelector('[data-testid="native-modal"]')).toBeNull();

    unmount();
  });

  it('calls onClose when backdrop is pressed', () => {
    const onClose = vi.fn();
    const { container, unmount } = render(
      <Modal isOpen onClose={onClose}>
        <Modal.Header>Native modal</Modal.Header>
        <Modal.Body>Body content</Modal.Body>
        <Modal.Footer>
          <Button>Done</Button>
        </Modal.Footer>
      </Modal>
    );

    const backdrop = container.querySelector<HTMLButtonElement>(
      '[data-testid="modal-backdrop"]'
    );

    act(() => backdrop?.click());

    expect(onClose).toHaveBeenCalledOnce();

    unmount();
  });

  it('calls onClose from the header close button and keeps controls focusable', () => {
    const onClose = vi.fn();
    const { container, unmount } = render(
      <Modal isOpen onClose={onClose}>
        <Modal.Header>Native modal</Modal.Header>
        <Modal.Body>Body content</Modal.Body>
        <Modal.Footer>
          <Button>Done</Button>
        </Modal.Footer>
      </Modal>
    );

    const closeButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Close modal"]'
    );
    const doneButton = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent === 'Done');

    closeButton?.focus();
    expect(document.activeElement).toBe(closeButton);

    doneButton?.focus();
    expect(document.activeElement).toBe(doneButton);

    act(() => closeButton?.click());

    expect(onClose).toHaveBeenCalledOnce();

    unmount();
  });

  it('does not expose backdrop as close button when backdrop close is disabled', () => {
    const onClose = vi.fn();

    const { container, unmount } = render(
      <Modal isOpen closeOnBackdrop={false} onClose={onClose}>
        <Modal.Header>Native modal</Modal.Header>
        <Modal.Body>Body content</Modal.Body>
      </Modal>
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

    expect(onClose).not.toHaveBeenCalled();

    unmount();
  });
});
