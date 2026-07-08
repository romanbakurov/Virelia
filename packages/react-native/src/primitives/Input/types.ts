import type { BaseInputProps } from '@vellira-ui/types';
import type { ReactElement } from 'react';
import type {
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

export type { InputSize, InputType } from '@vellira-ui/types';

export type NativeInputKeyboardType = TextInputProps['keyboardType'];

export type InputIconElement = ReactElement<{
  color?: string;
  size?: number;
}>;

export interface InputProps
  extends
    BaseInputProps,
    Omit<
      TextInputProps,
      | 'value'
      | 'defaultValue'
      | 'onChange'
      | 'onChangeText'
      | 'editable'
      | 'style'
      | 'placeholder'
    > {
  leftAdornment?: InputIconElement;
  rightAdornment?: InputIconElement;
  clearIcon?: InputIconElement;
  iconSize?: number;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  testID?: string;
  keyboardType?: NativeInputKeyboardType;
  secureTextEntry?: boolean;
}
