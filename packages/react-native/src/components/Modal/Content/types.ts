import type { BaseModalContentProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ModalContentProps extends BaseModalContentProps {
  /** Modal panel content. */
  children: ReactNode;
  /** Style applied to the modal panel. */
  style?: StyleProp<ViewStyle>;
}
