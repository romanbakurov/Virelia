import type { BaseTabsListProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface TabsListProps extends BaseTabsListProps {
  /** Tab trigger children. */
  children: ReactNode;
  /** Style applied to the tab list container. */
  style?: StyleProp<ViewStyle>;
}

export type { TabsIndicatorProps } from './TabsIndicator';
