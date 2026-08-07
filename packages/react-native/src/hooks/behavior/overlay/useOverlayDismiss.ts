import { useCallback, useEffect } from 'react';

import { BackHandler, Platform } from 'react-native';

import { useOverlayStack } from './useOverlayStack';

export type OverlayDismissOptions = {
  active: boolean;
  closeOnEscape?: boolean;
  closeOnOutsidePress?: boolean;
  id: string;
  requestClose: () => void;
};

export const useOverlayDismiss = ({
  active,
  closeOnEscape = true,
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

        requestClose();

        return true;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [active, closeOnEscape, isTopOverlay, requestClose, requestTopClose]);

  return {
    isTopOverlay,
    requestClose: requestTopClose,
    requestOutsideClose,
  };
};
