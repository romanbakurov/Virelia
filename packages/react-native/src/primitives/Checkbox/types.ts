import type { BaseCheckboxProps } from '@vellira-ui/types';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

export interface CheckboxProps
  extends BaseCheckboxProps, Omit<PressableProps, 'onPress' | 'disabled'> {
  label?: string;
  description?: string;
  style?: StyleProp<ViewStyle>;
}
