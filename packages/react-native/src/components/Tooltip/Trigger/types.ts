import type { ReactNode } from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

export interface TooltipTriggerProps extends Omit<
  PressableProps,
  'children' | 'disabled' | 'style'
> {
  children: ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}
