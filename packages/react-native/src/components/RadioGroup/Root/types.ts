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
  /** Visible group label. */
  label?: ReactNode;
  /** Supporting text rendered with the group. */
  description?: ReactNode;
  /** Validation error rendered for invalid state. */
  error?: string;
  /** Radio item children. */
  children?: ReactNode;
  /** Selected color inherited by child radios. */
  color?: RadioColor;

  /** Style applied to the root container. */
  style?: StyleProp<ViewStyle>;
  /** Style applied to the items container. */
  itemsStyle?: StyleProp<ViewStyle>;
  /** Style applied to label text. */
  labelStyle?: StyleProp<TextStyle>;
  /** Style applied to description text. */
  descriptionStyle?: StyleProp<TextStyle>;
  /** Style applied to error text. */
  errorStyle?: StyleProp<TextStyle>;
}
