export type CheckboxSize = 'sm' | 'md' | 'lg';
export type CheckboxColor =
  'primary' | 'neutral' | 'success' | 'warning' | 'danger';
export type CheckboxLabelPosition = 'start' | 'end';

export interface BaseCheckboxProps {
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial checked state for uncontrolled usage. */
  defaultChecked?: boolean;
  /** Disables interaction and applies disabled styling. */
  disabled?: boolean;
  /** Marks the checkbox as required. */
  required?: boolean;
  /** Displays and announces a mixed selection state. */
  indeterminate?: boolean;
  /** Error message rendered for invalid state. */
  error?: string;
  /** Controls checkbox indicator and label sizing. */
  size?: CheckboxSize;
  /** Selected checkbox color. */
  color?: CheckboxColor;
  /** Position of the visible label relative to the checkbox. */
  labelPosition?: CheckboxLabelPosition;

  /** Called when the user changes the checked state. */
  onCheckedChange?: (checked: boolean) => void;
}
