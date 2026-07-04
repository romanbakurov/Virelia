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
  return (
    <ModalContext.Provider value={{ onClose }}>
      <ModalOverlay
        isOpen={isOpen}
        onClose={onClose}
        closeOnBackdrop={closeOnBackdrop}
        overlayStyle={overlayStyle}
      >
        <ModalContent style={contentStyle}>{children}</ModalContent>
      </ModalOverlay>
    </ModalContext.Provider>
  );
};

ModalRoot.displayName = 'Modal';
