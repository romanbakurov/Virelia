import type { MutableRefObject } from 'react';
import type { Animated, View } from 'react-native';

import type { ModalAnimation } from '../types';

export interface ModalContextValue {
  animation: ModalAnimation;
  animationProgress: Animated.Value;
  closeOnOutsidePress: boolean;
  zIndex: number;
  onClose: () => void;
  onOutsideClose: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  shouldRender: boolean;
  triggerRef: MutableRefObject<View | null>;
}
