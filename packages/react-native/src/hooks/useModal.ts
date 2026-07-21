import { useCallback, useId } from 'react';

import { useControllableState } from './useControllableState';

export interface UseModalParams {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnEscape?: boolean;
  closeOnOutsidePress?: boolean;
}

export const useModal = ({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnEscape,
  closeOnOutsidePress,
}: UseModalParams) => {
  const contentId = useId();
  const titleId = useId();
  const descriptionId = useId();
  const [resolvedOpen, setResolvedOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const requestClose = useCallback(() => {
    setResolvedOpen(false);
  }, [setResolvedOpen]);

  return {
    open: resolvedOpen,
    shouldRender: resolvedOpen,
    setOpen: setResolvedOpen,
    requestClose,
    closeOnOutsidePress: closeOnOutsidePress ?? true,
    closeOnEscape: closeOnEscape ?? true,
    contentId,
    titleId,
    descriptionId,
  };
};
