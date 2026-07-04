import type { BaseModalProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ModalProps extends BaseModalProps {
  children: ReactNode;
  overlayStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export interface ModalOverlayProps {
  isOpen: boolean;
  onClose?: () => void;
  closeOnBackdrop?: boolean;
  children: ReactNode;
  overlayStyle?: StyleProp<ViewStyle>;
}
