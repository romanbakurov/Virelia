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
  /** Content rendered in the native portal modal. */
  children: ReactNode;
  /** Controls whether the portal modal is visible. */
  visible?: boolean;
}

export interface PortalProviderProps {
  /** Provider children that can render portals. */
  children: ReactNode;
  /** Reserved container value for API parity with web portals. */
  container?: unknown;
}
