import type {
  BaseModalProps,
  ModalAnimation,
  ModalAnimationDuration,
  ModalAnimationEasing,
} from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ModalProps extends BaseModalProps {
  children: ReactNode;
}

export interface ModalOverlayProps {
  children: ReactNode;
  overlayStyle?: StyleProp<ViewStyle>;
}

export type { ModalAnimation, ModalAnimationDuration, ModalAnimationEasing };
