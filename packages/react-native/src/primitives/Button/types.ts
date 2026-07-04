import type { BaseButtonProps } from '@vellira-ui/types';
import type { ReactElement, ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

export type ButtonIconElement = ReactElement<{
  color?: string;
  size?: number;
}>;

export interface ButtonProps extends BaseButtonProps {
  children?: ReactNode;
  leftIcon?: ButtonIconElement;
  rightIcon?: ButtonIconElement;
  fullWidth?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
  iconSize?: number;
}
