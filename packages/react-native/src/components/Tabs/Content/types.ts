import type { BaseTabsContentProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface TabsContentProps extends BaseTabsContentProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}
