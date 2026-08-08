import { useEffect, useRef, useState } from 'react';

import type { View } from 'react-native';
import { AccessibilityInfo, Animated, Easing, Platform } from 'react-native';

import {
  useModal,
  useOverlayDismiss,
  useOverlayFocusRestore,
} from '../../../hooks';
import { nativeThemes } from '../../../theme';
import ModalContext from '../internal/ModalContext';
import type { ModalProps } from '../types';

const linearEasing = (value: number) => value;

const easingMap = {
  standard: Easing?.bezier?.(0.22, 1, 0.36, 1) ?? linearEasing,
  linear: Easing?.linear ?? linearEasing,
  ease: Easing?.ease ?? linearEasing,
  'ease-in': Easing?.in?.(Easing?.ease ?? linearEasing) ?? linearEasing,
  'ease-out': Easing?.out?.(Easing?.ease ?? linearEasing) ?? linearEasing,
  'ease-in-out': Easing?.inOut?.(Easing?.ease ?? linearEasing) ?? linearEasing,
} as const;

const parseDuration = (duration: string) => Number.parseFloat(duration);

const resolveDuration = (duration: ModalProps['duration']) => {
  if (typeof duration === 'number') {
    return {
      close: duration,
      open: duration,
    };
  }

  return {
    close:
      duration?.close ??
      parseDuration(nativeThemes.light.components.modal.motion.closeDuration),
    open:
      duration?.open ??
      parseDuration(nativeThemes.light.components.modal.motion.openDuration),
  };
};

export const ModalRoot = ({
  open,
  defaultOpen = false,
  onOpenChange,
  animation = 'scale',
  duration,
  easing = 'standard',
  closeOnOutsidePress = true,
  children,
}: ModalProps) => {
  const initialOpen = open ?? defaultOpen;
  const animationProgress = useRef(new Animated.Value(initialOpen ? 1 : 0));
  const triggerRef = useRef<View | null>(null);

  const { restoreFocusAfterClose } = useOverlayFocusRestore({
    triggerRef,
  });

  const [shouldRender, setShouldRender] = useState(initialOpen);
  const [reduceMotion, setReduceMotion] = useState(false);
  const modal = useModal({
    open,
    defaultOpen,
    onOpenChange,
    closeOnOutsidePress,
  });

  const closeAndRestoreFocus = () => {
    modal.requestClose();
    restoreFocusAfterClose();
  };

  const dismiss = useOverlayDismiss({
    id: modal.contentId,
    active: modal.open,
    closeOnOutsidePress: modal.closeOnOutsidePress,
    requestClose: closeAndRestoreFocus,
  });
  const animationDuration = resolveDuration(duration);
  const shouldAnimate = animation !== 'none' && !reduceMotion;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.().then(setReduceMotion);

    const subscription = AccessibilityInfo.addEventListener?.(
      'reduceMotionChanged',
      setReduceMotion
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    const progress = animationProgress.current;

    if (modal.open) {
      setShouldRender(true);

      if (!shouldAnimate) {
        progress.setValue(1);
        return;
      }

      progress.setValue(0);

      Animated.timing(progress, {
        toValue: 1,
        duration: animationDuration.open,
        easing: easingMap[easing],
        useNativeDriver: Platform.OS !== 'web',
      }).start();

      return;
    }

    if (!shouldAnimate) {
      progress.setValue(0);
      setShouldRender(false);
      return;
    }

    Animated.timing(progress, {
      toValue: 0,
      duration: animationDuration.close,
      easing: easingMap[easing],
      useNativeDriver: Platform.OS !== 'web',
    }).start(({ finished }) => {
      if (finished) {
        setShouldRender(false);
      }
    });
  }, [
    animationDuration.close,
    animationDuration.open,
    easing,
    modal.open,
    shouldAnimate,
  ]);

  return (
    <ModalContext.Provider
      value={{
        animation,
        animationProgress: animationProgress.current,
        closeOnOutsidePress: modal.closeOnOutsidePress,
        onClose: dismiss.requestClose,
        onOutsideClose: dismiss.requestOutsideClose,
        open: modal.open,
        setOpen: modal.setOpen,
        shouldRender,
        triggerRef,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

ModalRoot.displayName = 'ModalRoot';
