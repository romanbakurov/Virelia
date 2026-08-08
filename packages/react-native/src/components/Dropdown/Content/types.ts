import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface DropdownContentProps {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}
