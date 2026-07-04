import type { BaseModalFooterProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ModalFooterProps extends BaseModalFooterProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}
