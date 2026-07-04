import type { BaseModalProps } from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { NativeComponentProps } from '../../types';

export interface ModalProps extends BaseModalProps, NativeComponentProps {
  children: ReactNode;
  overlayStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export interface ModalOverlayProps {
  isOpen: boolean;
  onClose?: () => void;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  children: ReactNode;
  overlayStyle?: StyleProp<ViewStyle>;
}
