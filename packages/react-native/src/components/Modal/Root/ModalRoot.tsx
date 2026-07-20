import { useModal } from '@vellira-ui/core';

import ModalContext from '../internal/ModalContext';
import type { ModalProps } from '../types';

export const ModalRoot = ({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnOutsidePress = true,
  children,
}: ModalProps) => {
  const modal = useModal({
    open,
    defaultOpen,
    onOpenChange,
    closeOnOutsidePress,
  });

  return (
    <ModalContext.Provider
      value={{
        closeOnOutsidePress: modal.closeOnOutsidePress,
        onClose: modal.requestClose,
        open: modal.open,
        setOpen: modal.setOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

ModalRoot.displayName = 'ModalRoot';
