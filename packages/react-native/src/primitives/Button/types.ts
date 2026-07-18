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
  /** Visible button content. */
  children?: ReactNode;

  /** Icon rendered before the button content. */
  iconStart?: ButtonIconElement;
  /** Icon rendered after the button content. */
  iconEnd?: ButtonIconElement;
  /** Compact badge rendered after the label when not icon-only. */
  badge?: ReactNode;
  /** Keyboard shortcut hint rendered after the label when not icon-only. */
  shortcut?: ReactNode;
  /** Overrides the size-derived icon size in pixels. */
  iconSize?: number;

  /** Called when the user presses the button. */
  onPress?: (event: GestureResponderEvent) => void;
  /** Extra root style. */
  style?: StyleProp<ViewStyle>;
  /** Extra text style. */
  textStyle?: StyleProp<TextStyle>;

  /** Accessible label for screen readers. */
  accessibilityLabel?: string;
  /** Test identifier. */
  testID?: string;
}
