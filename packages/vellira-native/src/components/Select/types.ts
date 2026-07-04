import type {
  BaseSelectOption,
  BaseSelectProps,
} from '@romanbakurov/vellira-types';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { NativeComponentProps } from '../../types';

export type { SelectSize } from '@romanbakurov/vellira-types';

export interface SelectOption extends BaseSelectOption {
  label: string;
}

export interface SelectProps
  extends Omit<BaseSelectProps, 'options'>, NativeComponentProps {
  label?: string;
  description?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  triggerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  pickerStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}
