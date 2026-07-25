import type { BaseTabsListProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface TabsListProps extends BaseTabsListProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}
