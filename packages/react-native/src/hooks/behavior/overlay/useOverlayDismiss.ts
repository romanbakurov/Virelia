import { useCallback, useEffect } from 'react';

import type { PressableProps } from 'react-native';
import { BackHandler, Platform } from 'react-native';

import {
  type NativeOverlayManager,
  useNativeOverlayManager,
} from '../../../managers/OverlayManager';

import { useOverlayRegistration } from './useOverlayRegistration';

export type OverlayDismissOptions = {
  active: boolean;
  closeOnEscape?: boolean;
  closeOnOutsidePress?: boolean;
  id: string;
  requestClose: () => void;
  requestOutsideClose?: () => void;
};

export type OverlayOutsidePressProps = Pick<
  PressableProps,
  'accessibilityLabel' | 'accessibilityRole' | 'onPress'
>;

export type OverlayOutsidePressPropsOptions = {
  accessibilityLabel?: string;
};

const dismissListeners = new Map<
  NativeOverlayManager,
  { count: number; detach: () => void }
>();

function attachDismissListener(manager: NativeOverlayManager) {
  if (dismissListeners.has(manager)) return;

  if (Platform.OS === 'web') {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      manager.dispatchTopDismiss();
    };

    document.addEventListener('keydown', handleKeyDown);

    dismissListeners.set(manager, {
      count: 0,
      detach: () => {
        document.removeEventListener('keydown', handleKeyDown);
        dismissListeners.delete(manager);
      },
    });

    return;
  }

  const subscription = BackHandler.addEventListener('hardwareBackPress', () =>
    manager.dispatchTopDismiss()
  );

  dismissListeners.set(manager, {
    count: 0,
    detach: () => {
      subscription.remove();
      dismissListeners.delete(manager);
    },
  });
}

function retainDismissListener(manager: NativeOverlayManager) {
  attachDismissListener(manager);

  const retained = dismissListeners.get(manager);
  if (!retained) return () => undefined;

  retained.count += 1;

  return () => {
    const current = dismissListeners.get(manager);
    if (!current) return;

    current.count = Math.max(0, current.count - 1);

    if (current.count > 0) return;

    current.detach();
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
  const nativeOverlayManager = useNativeOverlayManager();
  const registration = useOverlayRegistration({ active, id });
  const { isTopOverlay } = registration;

  const requestTopClose = useCallback(() => {
    if (!isTopOverlay()) return;

    requestClose();
  }, [isTopOverlay, requestClose]);

  const requestOutsideTopClose = useCallback(() => {
    nativeOverlayManager.dispatchTopOutsidePress();
  }, [nativeOverlayManager]);

  const getOutsidePressProps = useCallback(
    ({
      accessibilityLabel = 'Dismiss overlay',
    }: OverlayOutsidePressPropsOptions = {}): OverlayOutsidePressProps => {
      if (!active || !closeOnOutsidePress) {
        return {
          accessibilityLabel: undefined,
          accessibilityRole: undefined,
          onPress: undefined,
        };
      }

      return {
        accessibilityLabel,
        accessibilityRole: 'button',
        onPress: requestOutsideTopClose,
      };
    },
    [active, closeOnOutsidePress, requestOutsideTopClose]
  );

  useEffect(() => {
    if (!active) return;

    return nativeOverlayManager.registerOutsidePressHandler(id, () => {
      if (!closeOnOutsidePress) return false;
      if (!isTopOverlay()) return false;

      if (requestOutsideClose) {
        requestOutsideClose();
        return true;
      }

      requestClose();

      return true;
    });
  }, [
    active,
    closeOnOutsidePress,
    id,
    isTopOverlay,
    nativeOverlayManager,
    requestClose,
    requestOutsideClose,
  ]);

  useEffect(() => {
    if (!active) return;

    const releaseDismissListener = retainDismissListener(nativeOverlayManager);
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
  }, [active, closeOnEscape, id, nativeOverlayManager, requestTopClose]);

  return {
    zIndex: registration.zIndex,
    isTopOverlay,
    getOutsidePressProps,
    requestClose: requestTopClose,
    requestOutsideClose: requestOutsideTopClose,
  };
};
