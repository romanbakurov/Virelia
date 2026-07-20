import type { BaseRadioGroupProps, RadioColor } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewProps, ViewStyle } from 'react-native';

export interface RadioGroupProps
  extends
    BaseRadioGroupProps,
    Omit<
      ViewProps,
      'children' | 'style' | 'accessibilityRole' | 'accessibilityState'
    > {
  label?: ReactNode;
  description?: ReactNode;
  error?: string;
  children?: ReactNode;
  /** Selected color inherited by child radios. */
  color?: RadioColor;

  style?: StyleProp<ViewStyle>;
  itemsStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
}
