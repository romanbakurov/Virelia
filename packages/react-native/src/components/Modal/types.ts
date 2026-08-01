import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type ModalAnimation = 'scale' | 'slide' | 'fade' | 'none';
export type ModalAnimationEasing =
  'standard' | 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

export type ModalAnimationDuration =
  | number
  | {
      close?: number;
      open?: number;
    };

export interface ModalProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  animation?: ModalAnimation;
  duration?: ModalAnimationDuration;
  easing?: ModalAnimationEasing;
  closeOnOutsidePress?: boolean;
  closeOnEscape?: boolean;
}

export interface ModalOverlayProps {
  children: ReactNode;
  overlayStyle?: StyleProp<ViewStyle>;
}
