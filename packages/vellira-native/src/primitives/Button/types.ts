import type { BaseButtonProps } from '@romanbakurov/vellira-types';
import type { ReactElement, ReactNode } from 'react';
import type { PressableProps } from 'react-native';

import type { NativeComponentProps } from '../../types';

export type { ButtonColor, ButtonSize } from '@romanbakurov/vellira-types';

export type ButtonIconElement = ReactElement<{
  color?: string;
  size?: number;
}>;

export interface ButtonProps
  extends
    BaseButtonProps,
    NativeComponentProps,
    Omit<
      PressableProps,
      'children' | 'disabled' | 'onPress' | 'style' | 'testID'
    > {
  children?: ReactNode;
  leftIcon?: ButtonIconElement;
  rightIcon?: ButtonIconElement;
  fullWidth?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  iconSize?: number;
}
