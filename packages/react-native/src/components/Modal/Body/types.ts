import type { BaseModalBodyProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ModalBodyProps extends BaseModalBodyProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}
