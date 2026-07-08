import type { BaseInputProps, InputAdornmentTone } from '@vellira-ui/types';
import type { ReactElement } from 'react';
import type {
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

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
  leftAdornmentTone?: InputAdornmentTone;
  rightAdornmentTone?: InputAdornmentTone;
  clearIcon?: InputIconElement;
  iconSize?: number;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  testID?: string;
  keyboardType?: NativeInputKeyboardType;
  secureTextEntry?: boolean;
}
