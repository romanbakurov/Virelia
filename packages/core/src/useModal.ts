import { useId, useMemo } from 'react';

export interface UseModalParams {
  isOpen: boolean;
  onClose: () => void;
  closeOnBackdrop?: boolean;
  closeOnClick?: boolean;
  closeOnEsc?: boolean;
}

export const useModal = ({
  isOpen,
  onClose,
  closeOnBackdrop,
  closeOnClick,
  closeOnEsc = true,
}: UseModalParams) => {
  const titleId = useId();
  const descriptionId = useId();
  const resolvedCloseOnBackdrop = closeOnBackdrop ?? closeOnClick;

  const contextValue = useMemo(
    () => ({ onClose, titleId, descriptionId }),
    [descriptionId, onClose, titleId]
  );

  return {
    isOpen,
    shouldRender: isOpen,
    onClose,
    closeOnBackdrop: resolvedCloseOnBackdrop,
    closeOnEsc,
    titleId,
    descriptionId,
    contextValue,
  };
};
