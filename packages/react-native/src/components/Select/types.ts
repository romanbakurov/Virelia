import type { BaseSelectOption, BaseSelectProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type SelectOption = BaseSelectOption;

export interface SelectProps extends Omit<
  BaseSelectProps,
  'options' | 'error'
> {
  label?: string;
  description?: string;
  options: SelectOption[];
  error?: ReactNode;
  style?: StyleProp<ViewStyle>;
  triggerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  pickerStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
