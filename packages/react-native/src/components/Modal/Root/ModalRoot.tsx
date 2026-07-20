import { useModal } from '../../../hooks';
import { useNativeDismiss } from '../../../managers';
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
  const dismiss = useNativeDismiss({
    id: modal.contentId,
    visible: modal.open,
    closeOnOutsidePress: modal.closeOnOutsidePress,
    onClose: modal.requestClose,
  });

  return (
    <ModalContext.Provider
      value={{
        closeOnOutsidePress: modal.closeOnOutsidePress,
        onClose: dismiss.requestClose,
        onOutsideClose: dismiss.requestOutsideClose,
        open: modal.open,
        setOpen: modal.setOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

ModalRoot.displayName = 'ModalRoot';
