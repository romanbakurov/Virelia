import type { BaseModalFooterProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ModalFooterProps extends BaseModalFooterProps {
  /** Footer actions or custom footer content. */
  children: ReactNode;
  /** Style applied to the footer container. */
  style?: StyleProp<ViewStyle>;
}
