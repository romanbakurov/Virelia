import { useModal } from '@vellira-ui/core';

import { ModalContent } from './Content/ModalContent';
import ModalContext from './ModalContext';
import { ModalOverlay } from './ModalOverlay';
import type { ModalProps } from './types';

export const ModalRoot = ({
  isOpen,
  onClose,
  closeOnBackdrop = true,
  children,
  overlayStyle,
  contentStyle,
}: ModalProps) => {
  const modal = useModal({
    isOpen,
    onClose,
    closeOnBackdrop,
  });

  return (
    <ModalContext.Provider value={{ onClose: modal.onClose }}>
      <ModalOverlay
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        closeOnBackdrop={modal.closeOnBackdrop}
        overlayStyle={overlayStyle}
      >
        <ModalContent style={contentStyle}>{children}</ModalContent>
      </ModalOverlay>
    </ModalContext.Provider>
  );
};

ModalRoot.displayName = 'Modal';
