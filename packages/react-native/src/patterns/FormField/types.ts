import type { BaseFormFieldProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface FormFieldProps extends BaseFormFieldProps {
  label?: string;
  description?: string;
  error?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  controlStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
}
