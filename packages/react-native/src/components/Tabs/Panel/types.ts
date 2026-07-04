import type { BaseTabsPanelProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface TabsPanelProps extends BaseTabsPanelProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}
