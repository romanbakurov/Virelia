import { useCallback, useEffect } from 'react';

import { BackHandler, Platform } from 'react-native';

import { nativeOverlayManager } from '../../../managers/OverlayManager';

import { useOverlayRegistration } from './useOverlayRegistration';

export type OverlayDismissOptions = {
  active: boolean;
  closeOnEscape?: boolean;
  closeOnOutsidePress?: boolean;
  id: string;
  requestClose: () => void;
  requestOutsideClose?: () => void;
};

let activeDismissHandlers = 0;
let detachDismissListener: (() => void) | undefined;

function attachDismissListener() {
  if (detachDismissListener) return;

  if (Platform.OS === 'web') {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      nativeOverlayManager.dispatchTopDismiss();
    };

    document.addEventListener('keydown', handleKeyDown);

    detachDismissListener = () => {
      document.removeEventListener('keydown', handleKeyDown);
      detachDismissListener = undefined;
    };

    return;
  }

  const subscription = BackHandler.addEventListener('hardwareBackPress', () =>
    nativeOverlayManager.dispatchTopDismiss()
  );

  detachDismissListener = () => {
    subscription.remove();
    detachDismissListener = undefined;
  };
}

function retainDismissListener() {
  activeDismissHandlers += 1;
  attachDismissListener();

  return () => {
    activeDismissHandlers = Math.max(0, activeDismissHandlers - 1);

    if (activeDismissHandlers > 0) return;

    detachDismissListener?.();
  };
}

export const useOverlayDismiss = ({
  active,
  closeOnEscape = true,
  closeOnOutsidePress = true,
  id,
  requestClose,
  requestOutsideClose,
}: OverlayDismissOptions) => {
  const registration = useOverlayRegistration({ active, id });
  const { isTopOverlay, layer } = registration;

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
    if (!active) return;

    const releaseDismissListener = retainDismissListener();
    const unregisterDismissHandler =
      nativeOverlayManager.registerDismissHandler(id, () => {
        if (!closeOnEscape) return false;

        requestTopClose();

        return true;
      });

    return () => {
      unregisterDismissHandler();
      releaseDismissListener();
    };
  }, [active, closeOnEscape, id, requestTopClose]);

  return {
    layer,
    zIndex: registration.zIndex,
    isTopOverlay,
    requestClose: requestTopClose,
    requestOutsideClose: requestOutsideTopClose,
  };
};
