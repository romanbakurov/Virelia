import type {
  BaseModalProps,
  ModalAnimation,
  ModalAnimationDuration,
  ModalAnimationEasing,
} from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ModalProps extends BaseModalProps {
  /** Modal trigger, overlay, content, and compound children. */
  children: ReactNode;
}

export interface ModalOverlayProps {
  /** Overlay content, usually modal content. */
  children: ReactNode;
  /** Style applied to the overlay backdrop. */
  overlayStyle?: StyleProp<ViewStyle>;
}

export type { ModalAnimation, ModalAnimationDuration, ModalAnimationEasing };
