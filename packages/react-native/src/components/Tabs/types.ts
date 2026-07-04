import type {
  BaseTabsProps,
  Orientation,
  TabsAppearance,
} from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface TabsProps extends BaseTabsProps {
  children: ReactNode;
  appearance?: TabsAppearance;
  style?: StyleProp<ViewStyle>;
}

export interface TabsContextValue {
  activeIndex: number;
  appearance: TabsAppearance;
  orientation: Orientation;
  setActiveIndex: (index: number) => void;
}
