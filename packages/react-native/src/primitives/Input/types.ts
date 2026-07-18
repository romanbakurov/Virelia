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
  /** Controlled value. */
  value?: string;
  /** Initial uncontrolled value. */
  defaultValue?: string;
  /** Called with the next string value. */
  onValueChange?: (value: string) => void;
  /** Semantic input type used to derive keyboard and secure entry behavior. */
  type?: InputType;

  /** Icon rendered at the start of the control. */
  startIcon?: InputIconElement;
  /** Icon rendered at the end of the control when no action is active. */
  endIcon?: InputIconElement;
  /** Custom clear action icon. */
  clearIcon?: InputIconElement;
  /** Tone for startIcon. */
  startIconTone?: InputAdornmentTone;
  /** Tone for endIcon. */
  endIconTone?: InputAdornmentTone;
  /** Tone for clearIcon. */
  clearIconTone?: InputAdornmentTone;
  /** Icon size in pixels. */
  iconSize?: number;
  /** Style for the outer container. */
  containerStyle?: StyleProp<ViewStyle>;
  /** Style for the TextInput. */
  inputStyle?: StyleProp<TextStyle>;
  /** Test identifier. */
  testID?: string;
  /** Native keyboard type override. */
  keyboardType?: NativeInputKeyboardType;
  /** Native secure text entry override. */
  secureTextEntry?: boolean;
}
