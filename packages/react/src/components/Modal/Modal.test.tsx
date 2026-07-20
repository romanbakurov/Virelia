import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { Button } from '../../primitives/Button';
import { expectNoA11yViolations } from '../../test-utils/a11y';
import { render } from '../../test-utils/render';

import { Modal } from './Modal';

function pressDocumentKey(key: string) {
  act(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key }));
  });
}

function pressOutside() {
  act(() => {
    document.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  });
}

const textById = (id: string | null | undefined) =>
  id ? document.getElementById(id)?.textContent : undefined;

afterEach(() => {
  document.body.innerHTML = '';
  document.body.style.overflow = '';
});

describe('Modal', () => {
  it('renders compound dialog content and closes from Modal.Close', () => {
    const onOpenChange = vi.fn();
    const { unmount } = render(
      <Modal open onOpenChange={onOpenChange}>
        <Modal.Portal>
          <Modal.Overlay />
          <Modal.Content>
            <Modal.Header>
              <div>
                <Modal.Title>Delete file</Modal.Title>
                <Modal.Description>Are you sure?</Modal.Description>
              </div>
              <Modal.Close />
            </Modal.Header>
          </Modal.Content>
        </Modal.Portal>
      </Modal>
    );

    const dialog = document.querySelector('[role="dialog"]');
    const closeButton = document.querySelector<HTMLButtonElement>(
      '[aria-label="Close dialog"]'
    );

    expect(dialog).not.toBeNull();
    expect(dialog?.getAttribute('aria-modal')).toBe('true');

    act(() => closeButton?.click());
    expect(onOpenChange).toHaveBeenCalledWith(false);

    unmount();
  });

  it('connects title and description for accessibility', async () => {
    const { unmount } = render(
      <Modal open>
        <Modal.Portal>
          <Modal.Overlay />
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>Delete file</Modal.Title>
              <Modal.Description>Are you sure?</Modal.Description>
            </Modal.Header>
            <Modal.Body>Body content</Modal.Body>
          </Modal.Content>
        </Modal.Portal>
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

  it('supports Trigger asChild without rendering an extra button', () => {
    const { container, unmount } = render(
      <Modal>
        <Modal.Trigger asChild>
          <Button>Open modal</Button>
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Overlay />
          <Modal.Content ariaLabel='Settings'>
            <Modal.Body>Settings body</Modal.Body>
          </Modal.Content>
        </Modal.Portal>
      </Modal>
    );

    expect(document.querySelector('[role="dialog"]')).toBeNull();

    const trigger = container.querySelector<HTMLButtonElement>('button');
    act(() => trigger?.click());

    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    expect(container.querySelectorAll('button')).toHaveLength(1);

    unmount();
  });

  it('moves focus into the dialog and restores it to the opener on close', async () => {
    function ModalHarness({ open }: { open: boolean }) {
      return (
        <>
          <button type='button'>Open modal</button>
          <Modal open={open}>
            <Modal.Portal>
              <Modal.Overlay />
              <Modal.Content>
                <Modal.Header>
                  <Modal.Title>Delete file</Modal.Title>
                  <Modal.Close />
                </Modal.Header>
              </Modal.Content>
            </Modal.Portal>
          </Modal>
        </>
      );
    }

    const { container, rerender, unmount } = render(
      <ModalHarness open={false} />
    );
    const opener = container.querySelector<HTMLButtonElement>('button');

    opener?.focus();
    expect(document.activeElement).toBe(opener);

    rerender(<ModalHarness open />);
    await new Promise((resolve) => queueMicrotask(resolve));

    const closeButton = document.querySelector<HTMLButtonElement>(
      'button[aria-label="Close dialog"]'
    );

    expect(document.activeElement).toBe(closeButton);

    rerender(<ModalHarness open={false} />);
    await new Promise((resolve) => queueMicrotask(resolve));

    expect(document.activeElement).toBe(opener);

    unmount();
  });

  it('closes on Escape and outside press when enabled', () => {
    const onOpenChange = vi.fn();
    const { unmount } = render(
      <Modal open onOpenChange={onOpenChange}>
        <Modal.Portal>
          <Modal.Overlay />
          <Modal.Content ariaLabel='Confirm'>
            <Modal.Body>Confirm body</Modal.Body>
          </Modal.Content>
        </Modal.Portal>
      </Modal>
    );

    pressDocumentKey('Escape');
    pressOutside();

    expect(onOpenChange).toHaveBeenCalledWith(false);

    unmount();
  });

  it('does not close on Escape or outside press when disabled', () => {
    const onOpenChange = vi.fn();
    const { unmount } = render(
      <Modal
        open
        closeOnEscape={false}
        closeOnOutsidePress={false}
        onOpenChange={onOpenChange}
      >
        <Modal.Portal>
          <Modal.Overlay />
          <Modal.Content ariaLabel='Confirm'>
            <Modal.Body>Confirm body</Modal.Body>
          </Modal.Content>
        </Modal.Portal>
      </Modal>
    );

    pressDocumentKey('Escape');
    pressOutside();

    expect(onOpenChange).not.toHaveBeenCalled();

    unmount();
  });

  it('renders nothing in the portal when closed', () => {
    const { unmount } = render(
      <Modal open={false}>
        <Modal.Portal>
          <Modal.Overlay />
          <Modal.Content ariaLabel='Closed'>
            <Modal.Body>Closed body</Modal.Body>
          </Modal.Content>
        </Modal.Portal>
      </Modal>
    );

    expect(document.querySelector('[role="dialog"]')).toBeNull();

    unmount();
  });
});
