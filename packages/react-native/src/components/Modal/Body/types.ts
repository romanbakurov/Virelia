import type { BaseModalBodyProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ModalBodyProps extends BaseModalBodyProps {
  /** Main modal body content. */
  children: ReactNode;
  /** Style applied to the body container. */
  style?: StyleProp<ViewStyle>;
}
