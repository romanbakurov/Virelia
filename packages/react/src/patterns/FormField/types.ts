import type { BaseFormFieldProps } from '@vellira-ui/types';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

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
    Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'id'> {
  /** Field id used as the control id. Generated when omitted. */
  id?: string;

  /** Visible field label. */
  label?: ReactNode;
  /** Supporting text linked to compatible controls. */
  description?: ReactNode;
  /** Error content linked to compatible controls. Also implies invalid state. */
  error?: ReactNode;
  /** Supporting result/status message linked to compatible controls. Replaced by error when present. */
  message?: ReactNode;
  /** Additional label content, such as an info affordance. */
  labelInfo?: ReactNode;
  /** Action rendered next to the label without nesting inside the label element. */
  labelAction?: ReactNode;
  /** Optional marker shown for non-required fields. Do not combine with required. */
  optionalText?: ReactNode;
  /** Control or custom field layout content. */
  children: ReactNode;
  /** Automatically binds a direct native control child with generated id and aria props. */
  bindControl?: boolean;

  /** Class name applied to the control wrapper. */
  controlClassName?: string;
  /** Class name applied to the label. */
  labelClassName?: string;
  /** Class name applied to the description. */
  descriptionClassName?: string;
  /** Class name applied to the error content. */
  errorClassName?: string;
  /** Class name applied to the message content. */
  messageClassName?: string;
}
