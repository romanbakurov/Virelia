import { useModal } from '@vellira-ui/core';

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

export const Modal = ({
  isOpen,
  children,
  onClose,
  closeOnBackdrop,
  closeOnClick,
  closeOnEsc = true,
}: ModalProps) => {
  const modal = useModal({
    isOpen,
    onClose,
    closeOnBackdrop,
    closeOnClick,
    closeOnEsc,
  });

  if (!modal.shouldRender) return null;

  return (
    <ModalContext.Provider
      value={{
        onClose: modal.onClose,
        titleId: modal.titleId,
        descriptionId: modal.descriptionId,
      }}
    >
      <ModalOverlay
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        closeOnBackdrop={modal.closeOnBackdrop}
        closeOnEsc={modal.closeOnEsc}
      >
        <ModalContent>{children}</ModalContent>
      </ModalOverlay>
    </ModalContext.Provider>
  );
};

Modal.displayName = 'Modal';
