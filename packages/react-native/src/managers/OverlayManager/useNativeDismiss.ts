import { useCallback } from 'react';

import { useNativeOverlay } from './useNativeOverlay';

type UseNativeDismissParams = {
  id: string;
  visible: boolean;
  closeOnOutsidePress?: boolean;
  onClose: () => void;
};

export const useNativeDismiss = ({
  id,
  visible,
  closeOnOutsidePress = true,
  onClose,
}: UseNativeDismissParams) => {
  const { isTopOverlay } = useNativeOverlay({ id, visible });

  const requestClose = useCallback(() => {
    if (!isTopOverlay()) return;

    onClose();
  }, [isTopOverlay, onClose]);

  const requestOutsideClose = useCallback(() => {
    if (!closeOnOutsidePress) return;

    requestClose();
  }, [closeOnOutsidePress, requestClose]);

  return {
    isTopOverlay,
    requestClose,
    requestOutsideClose,
  };
};
