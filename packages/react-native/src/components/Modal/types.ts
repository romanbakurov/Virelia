import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ModalProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnOutsidePress?: boolean;
  closeOnEscape?: boolean;
}

export interface ModalOverlayProps {
  children: ReactNode;
  overlayStyle?: StyleProp<ViewStyle>;
}
