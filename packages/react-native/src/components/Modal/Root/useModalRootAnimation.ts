import { useEffect, useRef, useState } from 'react';

import { AccessibilityInfo, Animated, Easing, Platform } from 'react-native';

import { nativeThemes } from '../../../theme';
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

export type UseModalRootAnimationOptions = {
  animation: NonNullable<ModalProps['animation']>;
  defaultOpen: boolean;
  duration: ModalProps['duration'];
  easing: NonNullable<ModalProps['easing']>;
  open: boolean;
};

export function useModalRootAnimation({
  animation,
  defaultOpen,
  duration,
  easing,
  open,
}: UseModalRootAnimationOptions) {
  const animationProgress = useRef(new Animated.Value(defaultOpen ? 1 : 0));
  const [shouldRender, setShouldRender] = useState(defaultOpen);
  const [reduceMotion, setReduceMotion] = useState(false);
  const animationDuration = resolveDuration(duration);
  const shouldAnimate =
    animation !== 'none' && !reduceMotion && Platform.OS !== 'web';

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

    if (open) {
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
    open,
    shouldAnimate,
  ]);

  return {
    animationProgress: animationProgress.current,
    shouldRender,
  };
}
