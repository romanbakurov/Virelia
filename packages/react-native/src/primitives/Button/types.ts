import type { BaseButtonProps } from '@vellira-ui/types';
import type { ReactElement, ReactNode } from 'react';
import type {
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

export type ButtonIconElement = ReactElement<{
  color?: string;
  size?: number;
}>;

export interface ButtonProps extends BaseButtonProps {
  children?: ReactNode;
  leftIcon?: ButtonIconElement;
  rightIcon?: ButtonIconElement;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  iconSize?: number;
  testID?: string;
}
