export interface BaseFormFieldProps {
  /** Visible field label. */
  label?: string;
  /** Supporting text linked to the control. */
  description?: string;
  /** Error message linked to the control. Also implies invalid state. */
  error?: string;

  /** Marks the field and compatible child controls as required. */
  required?: boolean;
  /** Disables the field and compatible child controls. */
  disabled?: boolean;
  /** Shows invalid styling without requiring error text. */
  invalid?: boolean;
  /** Field layout direction. */
  orientation?: 'vertical' | 'horizontal';
  /** Label placement within the selected orientation. */
  labelPosition?: 'top' | 'start';
  /** Field size propagated to compatible child controls. */
  size?: 'sm' | 'md' | 'lg';
  /** Additional label content, such as an info affordance. */
  labelInfo?: string;
  /** Optional marker shown for non-required fields. Do not combine with required. */
  optionalText?: string;
}
