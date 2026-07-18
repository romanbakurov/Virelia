export type InputSize = 'sm' | 'md' | 'lg';
export type InputColor =
  'primary' | 'neutral' | 'success' | 'warning' | 'danger';
export type InputVariant = 'outline' | 'filled' | 'soft';
export type InputType =
  'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type InputMask = string | ((value: string) => string);
export type InputFormatter = (value: string) => string;
export type InputParser = (displayValue: string) => string;
export type InputAdornmentTone =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'muted'
  | 'inverse';

export interface InputBaseProps {
  /** Visible field label. */
  label?: string;
  /** Supporting text rendered with the field and linked to the control. */
  description?: string;
  /** Placeholder shown when the value is empty. */
  placeholder?: string;

  /** Field size. Inherits from FormField when omitted by compatible controls. */
  size?: InputSize;
  /** Semantic color palette for the control. */
  color?: InputColor;
  /** Visual variant for the control chrome. */
  variant?: InputVariant;

  /** Disables interaction. Also inherited from FormField by compatible controls. */
  disabled?: boolean;
  /** Makes the control non-editable while preserving focus and value semantics. */
  readOnly?: boolean;
  /** Marks the field as required. Also inherited from FormField. */
  required?: boolean;
  /** Shows invalid styling without requiring error text. Also inherited from FormField. */
  invalid?: boolean;
  /** Shows a spinner in the right slot and makes the field read-only. */
  loading?: boolean;

  /** Shows a clear action when the field has a value. */
  clearable?: boolean;
  /** Called when the clear action is activated. */
  onClear?: () => void;

  /** Shows a password visibility toggle for password inputs. */
  revealPassword?: boolean;
  /** Shows the current character count when maxLength is provided. */
  showCounter?: boolean;
  /** Input mask. String masks use # as a digit placeholder. */
  mask?: InputMask;
  /** Formats the displayed value without changing the controlled value. */
  format?: InputFormatter;
  /** Parses a formatted display value before mask/onValueChange. */
  parse?: InputParser;

  /** Error message. Also implies invalid state. */
  error?: string;
}
