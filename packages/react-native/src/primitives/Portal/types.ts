import type { ReactNode } from 'react';
import type { ModalProps } from 'react-native';

export interface PortalProps extends Pick<
  ModalProps,
  | 'animationType'
  | 'hardwareAccelerated'
  | 'navigationBarTranslucent'
  | 'onDismiss'
  | 'onRequestClose'
  | 'statusBarTranslucent'
> {
  children: ReactNode;
  visible?: boolean;
}

export interface PortalProviderProps {
  children: ReactNode;
  container?: unknown;
}
