import type {
  InputAdornmentTone,
  InputBaseProps,
  InputType,
} from '@vellira-ui/types';
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
    InputBaseProps,
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
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  type?: InputType;

  leftIcon?: InputIconElement;
  rightIcon?: InputIconElement;
  clearIcon?: InputIconElement;
  leftIconTone?: InputAdornmentTone;
  rightIconTone?: InputAdornmentTone;
  clearIconTone?: InputAdornmentTone;
  iconSize?: number;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  testID?: string;
  keyboardType?: NativeInputKeyboardType;
  secureTextEntry?: boolean;
}
