import { act } from 'react';

import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Button } from '../../primitives/Button';
import { expectNoA11yViolations } from '../../test-utils/a11y';
import { render } from '../../test-utils/render';

import { ModalBody } from './Body/ModalBody';
import { ModalFooter } from './Footer/ModalFooter';
import { ModalHeader } from './Header/ModalHeader';
import { Modal } from './Modal';

vi.mock('focus-trap-react', async () => {
  const React = await import('react');

  function FocusTrapMock({
    active,
    children,
    focusTrapOptions,
  }: {
    active?: boolean;
    children: ReactNode;
    focusTrapOptions?: {
      fallbackFocus?: () => HTMLElement;
      returnFocusOnDeactivate?: boolean;
    };
  }) {
    const previousFocusRef = React.useRef<Element | null>(null);

    React.useEffect(() => {
      if (!active) return;

      previousFocusRef.current = document.activeElement;

      queueMicrotask(() => {
        const firstFocusable =
          document.querySelector<HTMLElement>('[role="dialog"] button') ??
          focusTrapOptions?.fallbackFocus?.();

        firstFocusable?.focus();
      });

      return () => {
        if (
          focusTrapOptions?.returnFocusOnDeactivate &&
          previousFocusRef.current instanceof HTMLElement
        ) {
          previousFocusRef.current.focus();
        }
      };
    }, [active, focusTrapOptions]);

    return <>{children}</>;
  }

  return {
    default: FocusTrapMock,
  };
});

function pressDocumentKey(key: string) {
  act(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key }));
  });
}

const textById = (id: string | null | undefined) =>
  id ? document.getElementById(id)?.textContent : undefined;

afterEach(() => {
  document.body.innerHTML = '';
  document.body.style.overflow = '';
});

describe('Modal', () => {
  it('renders dialog content when open and closes from header button', () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <Modal isOpen onClose={onClose}>
        <ModalHeader>Delete file</ModalHeader>
        <ModalBody>Are you sure?</ModalBody>
        <ModalFooter>
          <Button>Cancel</Button>
        </ModalFooter>
      </Modal>
    );

    const dialog = document.querySelector('[role="dialog"]');
    const closeButton = document.querySelector<HTMLButtonElement>(
      '[aria-label="Close modal"]'
    );

    expect(dialog).not.toBeNull();
    expect(dialog?.getAttribute('aria-modal')).toBe('true');

    act(() => closeButton?.click());
    expect(onClose).toHaveBeenCalledOnce();

    unmount();
  });

  it('connects the dialog to header and body for accessibility', async () => {
    const { unmount } = render(
      <Modal isOpen onClose={() => undefined}>
        <ModalHeader>Delete file</ModalHeader>
        <ModalBody>Are you sure?</ModalBody>
      </Modal>
    );

    await expectNoA11yViolations(document.body);

    const dialog = document.querySelector('[role="dialog"]');
    const titleId = dialog?.getAttribute('aria-labelledby');
    const descriptionId = dialog?.getAttribute('aria-describedby');

    expect(titleId).toBeTruthy();
    expect(descriptionId).toBeTruthy();
    expect(textById(titleId)).toBe('Delete file');
    expect(textById(descriptionId)).toBe('Are you sure?');

    unmount();
  });

  it('exposes a named dialog, a described body, and named controls', async () => {
    const { unmount } = render(
      <Modal isOpen onClose={() => undefined}>
        <ModalHeader>Delete file</ModalHeader>
        <ModalBody>Are you sure?</ModalBody>
        <ModalFooter>
          <Button>Cancel</Button>
          <Button>Delete</Button>
        </ModalFooter>
      </Modal>
    );

    await expectNoA11yViolations(document.body);

    const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
    const closeButton = document.querySelector<HTMLButtonElement>(
      'button[aria-label="Close modal"]'
    );
    const buttons = Array.from(document.querySelectorAll('button')).map(
      (button) => button.textContent || button.getAttribute('aria-label')
    );

    expect(textById(dialog?.getAttribute('aria-labelledby'))).toBe(
      'Delete file'
    );
    expect(textById(dialog?.getAttribute('aria-describedby'))).toBe(
      'Are you sure?'
    );
    expect(closeButton?.getAttribute('aria-label')).toBe('Close modal');
    expect(buttons).toContain('Cancel');
    expect(buttons).toContain('Delete');

    unmount();
  });

  it('moves focus into the dialog and restores it to the opener on close', async () => {
    function ModalHarness({ isOpen }: { isOpen: boolean }) {
      return (
        <>
          <button type='button'>Open modal</button>
          <Modal isOpen={isOpen} onClose={() => undefined}>
            <ModalHeader>Delete file</ModalHeader>
            <ModalBody>Are you sure?</ModalBody>
            <ModalFooter>
              <Button>Cancel</Button>
            </ModalFooter>
          </Modal>
        </>
      );
    }

    const { container, rerender, unmount } = render(
      <ModalHarness isOpen={false} />
    );
    const opener = container.querySelector<HTMLButtonElement>('button');

    opener?.focus();
    expect(document.activeElement).toBe(opener);

    rerender(<ModalHarness isOpen />);

    await new Promise((resolve) => queueMicrotask(resolve));

    const closeButton = document.querySelector<HTMLButtonElement>(
      'button[aria-label="Close modal"]'
    );

    expect(document.activeElement).toBe(closeButton);

    rerender(<ModalHarness isOpen={false} />);

    await new Promise((resolve) => queueMicrotask(resolve));

    expect(document.activeElement).toBe(opener);

    unmount();
  });

  it('closes on Escape when enabled', () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <Modal isOpen onClose={onClose}>
        <ModalHeader>Delete file</ModalHeader>
        <ModalBody>Are you sure?</ModalBody>
      </Modal>
    );

    pressDocumentKey('Escape');

    expect(onClose).toHaveBeenCalledOnce();

    unmount();
  });

  it('does not close on Escape when disabled', () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <Modal isOpen closeOnEsc={false} onClose={onClose}>
        <ModalHeader>Delete file</ModalHeader>
        <ModalBody>Are you sure?</ModalBody>
      </Modal>
    );

    pressDocumentKey('Escape');

    expect(onClose).not.toHaveBeenCalled();

    unmount();
  });

  it('renders nothing when closed', () => {
    const { unmount } = render(
      <Modal isOpen={false} onClose={() => undefined}>
        <ModalHeader>Closed</ModalHeader>
      </Modal>
    );

    expect(document.querySelector('[role="dialog"]')).toBeNull();

    unmount();
  });
});
