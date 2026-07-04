import { forwardRef, useId } from 'react';

import { ModalContent } from './Content/ModalContent';
import ModalContext from './ModalContext';
import { ModalOverlay } from './ModalOverlay';
import type { ModalProps } from './types';

/**
 * Accessible modal dialog.
 *
 * @remarks
 * Modal.Header is required for accessibility.
 * It provides the title used by aria-labelledby.
 */

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    { isOpen, children, onClose, closeOnBackdrop, closeOnEsc = true, ...props },
    ref
  ) => {
    const titleId = useId();
    const descriptionId = useId();

    if (!isOpen) return null;

    return (
      <ModalContext.Provider value={{ onClose, titleId, descriptionId }}>
        <ModalOverlay
          {...props}
          ref={ref}
          isOpen={isOpen}
          onClose={onClose}
          closeOnBackdrop={closeOnBackdrop}
          closeOnEsc={closeOnEsc}
        >
          <ModalContent>{children}</ModalContent>
        </ModalOverlay>
      </ModalContext.Provider>
    );
  }
);

Modal.displayName = 'Modal';
