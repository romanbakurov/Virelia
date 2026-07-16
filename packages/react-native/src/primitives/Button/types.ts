import type { BaseButtonProps } from '@vellira-ui/types';
import type { ReactElement, ReactNode } from 'react';
import type {
  GestureResponderEvent,
  PressableProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

export type ButtonIconElement = ReactElement<{
  color?: string;
  size?: number;
}>;

export interface ButtonProps
  extends
    BaseButtonProps,
    Omit<
      PressableProps,
      | 'children'
      | 'disabled'
      | 'style'
      | 'onPress'
      | 'accessibilityRole'
      | 'accessibilityState'
      | 'children'
    > {
  children?: ReactNode;

  iconStart?: ButtonIconElement;
  iconEnd?: ButtonIconElement;
  badge?: ReactNode;
  shortcut?: ReactNode;
  iconSize?: number;

  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;

  accessibilityLabel?: string;
  testID?: string;
}
