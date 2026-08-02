export type FormFieldMessageTone = 'neutral' | 'success' | 'warning' | 'danger';
export type FormFieldMessageLive = 'off' | 'polite';

export interface BaseFormFieldProps {
  /** Visible field label. */
  label?: string;
  /** Supporting text linked to the control. */
  description?: string;
  /** Error message linked to the control. Also implies invalid state. */
  error?: string;
  /** Supporting result/status message rendered below the control. Replaced by error when present. */
  message?: string;
  /** Visual tone for message. Error always uses danger tone. */
  messageTone?: FormFieldMessageTone;
  /** Live region behavior for non-error message content. */
  messageLive?: FormFieldMessageLive;

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
  /** Action rendered next to the label without nesting inside the label element. */
  labelAction?: string;
  /** Optional marker shown for non-required fields. Do not combine with required. */
  optionalText?: string;
}
