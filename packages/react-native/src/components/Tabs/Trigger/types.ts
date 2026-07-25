import type { BaseTabsTriggerProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface TabsTriggerProps extends BaseTabsTriggerProps {
  children?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  description?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export interface TabsSlotProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}
