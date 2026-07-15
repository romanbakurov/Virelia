import type { BaseFormFieldProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewProps, ViewStyle } from 'react-native';

export interface FormFieldProps
  extends
    Omit<BaseFormFieldProps, 'label' | 'description' | 'error'>,
    Omit<ViewProps, 'children' | 'style' | 'accessibilityState'> {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  children: ReactNode;

  style?: StyleProp<ViewStyle>;
  controlStyle?: StyleProp<ViewStyle>;

  labelStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
}
