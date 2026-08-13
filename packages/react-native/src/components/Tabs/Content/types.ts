import type { BaseTabsContentProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface TabsContentProps extends BaseTabsContentProps {
  /** Tab panel content. */
  children?: ReactNode;
  /** Style applied to the tab panel container. */
  style?: StyleProp<ViewStyle>;
}
