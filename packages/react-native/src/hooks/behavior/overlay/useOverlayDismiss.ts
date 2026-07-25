import { useCallback } from 'react';

import { useOverlayStack } from './useOverlayStack';

export type OverlayDismissOptions = {
  active: boolean;
  closeOnOutsidePress?: boolean;
  id: string;
  requestClose: () => void;
};

export const useOverlayDismiss = ({
  active,
  closeOnOutsidePress = true,
  id,
  requestClose,
}: OverlayDismissOptions) => {
  const { isTopOverlay } = useOverlayStack({ active, id });

  const requestTopClose = useCallback(() => {
    if (!isTopOverlay()) return;

    requestClose();
  }, [isTopOverlay, requestClose]);

  const requestOutsideClose = useCallback(() => {
    if (!closeOnOutsidePress) return;

    requestTopClose();
  }, [closeOnOutsidePress, requestTopClose]);

  return {
    isTopOverlay,
    requestClose: requestTopClose,
    requestOutsideClose,
  };
};
