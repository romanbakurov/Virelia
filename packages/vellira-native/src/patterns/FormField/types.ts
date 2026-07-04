import type { BaseFormFieldProps } from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { NativeComponentProps } from '../../types';

export interface FormFieldProps
  extends BaseFormFieldProps, NativeComponentProps {
  label?: string;
  description?: string;
  error?: string;
  children: ReactNode;
  controlStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
}
