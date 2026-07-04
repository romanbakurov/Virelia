import type { BaseSelectOption, BaseSelectProps } from '@vellira-ui/types';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface SelectOption extends BaseSelectOption {
  label: string;
}

export interface SelectProps extends Omit<BaseSelectProps, 'options'> {
  label?: string;
  description?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
  triggerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  pickerStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}
