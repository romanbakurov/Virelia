import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

export interface TabsIndicatorProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const TabsIndicator = ({ children, style }: TabsIndicatorProps) => (
  <View
    accessibilityElementsHidden
    importantForAccessibility='no-hide-descendants'
    pointerEvents='none'
    style={style}
  >
    {children}
  </View>
);

TabsIndicator.displayName = 'Tabs.Indicator';
