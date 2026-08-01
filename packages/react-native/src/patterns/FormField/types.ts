import type { BaseFormFieldProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewProps, ViewStyle } from 'react-native';

export interface FormFieldProps
  extends
    Omit<
      BaseFormFieldProps,
      | 'description'
      | 'error'
      | 'label'
      | 'labelAction'
      | 'labelInfo'
      | 'message'
      | 'optionalText'
    >,
    Omit<ViewProps, 'children' | 'style' | 'accessibilityState'> {
  /** Visible field label. */
  label?: ReactNode;
  /** Supporting text rendered with the field. */
  description?: ReactNode;
  /** Error content. Also implies invalid state. */
  error?: ReactNode;
  /** Supporting result/status message. Replaced by error when present. */
  message?: ReactNode;
  /** Additional label content, such as an info affordance. */
  labelInfo?: ReactNode;
  /** Action rendered next to the label. */
  labelAction?: ReactNode;
  /** Optional marker shown for non-required fields. Do not combine with required. */
  optionalText?: ReactNode;
  /** Control or custom field layout content. */
  children: ReactNode;

  /** Style for the root field container. */
  style?: StyleProp<ViewStyle>;
  /** Style for the control wrapper. */
  controlStyle?: StyleProp<ViewStyle>;

  /** Style for the label. */
  labelStyle?: StyleProp<TextStyle>;
  /** Style for the description. */
  descriptionStyle?: StyleProp<TextStyle>;
  /** Style for the error content. */
  errorStyle?: StyleProp<TextStyle>;
  /** Style for the message content. */
  messageStyle?: StyleProp<TextStyle>;
}
