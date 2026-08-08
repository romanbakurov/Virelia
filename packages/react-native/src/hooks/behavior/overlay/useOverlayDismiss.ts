import { useCallback, useEffect } from 'react';

import { BackHandler, Platform } from 'react-native';

import { useOverlayStack } from './useOverlayStack';

export type OverlayDismissOptions = {
  active: boolean;
  closeOnEscape?: boolean;
  closeOnOutsidePress?: boolean;
  id: string;
  requestClose: () => void;
  requestOutsideClose?: () => void;
};

export const useOverlayDismiss = ({
  active,
  closeOnEscape = true,
  closeOnOutsidePress = true,
  id,
  requestClose,
  requestOutsideClose,
}: OverlayDismissOptions) => {
  const { isTopOverlay, layer } = useOverlayStack({ active, id });

  const requestTopClose = useCallback(() => {
    if (!isTopOverlay()) return;

    requestClose();
  }, [isTopOverlay, requestClose]);

  const requestOutsideTopClose = useCallback(() => {
    if (!closeOnOutsidePress) return;
    if (!isTopOverlay()) return;

    if (requestOutsideClose) {
      requestOutsideClose();
      return;
    }

    requestClose();
  }, [closeOnOutsidePress, isTopOverlay, requestClose, requestOutsideClose]);

  useEffect(() => {
    if (!active || !closeOnEscape) return;

    if (Platform.OS === 'web') {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape') return;

        requestTopClose();
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (!isTopOverlay()) return false;

        requestTopClose();

        return true;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [active, closeOnEscape, isTopOverlay, requestTopClose]);

  return {
    layer,
    isTopOverlay,
    requestClose: requestTopClose,
    requestOutsideClose: requestOutsideTopClose,
  };
};
