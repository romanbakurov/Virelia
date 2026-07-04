import type {
  BaseRadioGroupProps,
  BaseRadioOption,
  Orientation,
} from '@romanbakurov/vellira-types';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { NativeComponentProps } from '../../types';

export interface RadioOption extends BaseRadioOption {
  label: string;
}

export interface RadioGroupProps
  extends Omit<BaseRadioGroupProps, 'options'>, NativeComponentProps {
  label?: string;
  description?: string;
  options: RadioOption[];
  error?: string;
  orientation?: Orientation;
  optionStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}
