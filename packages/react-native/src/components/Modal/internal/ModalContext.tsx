import { createContext, useContext } from 'react';

import type { Animated } from 'react-native';

import type { ModalAnimation } from '../types';

interface ModalContextType {
  animation: ModalAnimation;
  animationProgress: Animated.Value;
  closeOnOutsidePress: boolean;
  onClose?: () => void;
  onOutsideClose?: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  shouldRender: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

ModalContext.displayName = 'ModalContext';

export const useModalContext = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('Modal compound components must be used inside Modal');
  }

  return context;
};

export default ModalContext;
