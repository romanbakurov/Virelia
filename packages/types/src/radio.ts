import type { RadioSize } from './radioGroup';
export type RadioValue = string;
export type RadioColor =
  'primary' | 'neutral' | 'success' | 'warning' | 'danger';

export interface BaseRadioProps {
  /** Value represented by the radio control. */
  value: RadioValue;
  /** Controlled checked state for standalone usage. */
  checked?: boolean;
  /** Initial checked state for uncontrolled standalone usage. */
  defaultChecked?: boolean;
  /** Disables interaction and applies disabled styling. */
  disabled?: boolean;
  /** Marks the radio as required. */
  required?: boolean;
  /** Validation error rendered for invalid state. */
  error?: string;
  /** Controls radio indicator and label sizing. */
  size?: RadioSize;
  /** Selected radio color. */
  color?: RadioColor;
  /** Called when the standalone checked state changes. */
  onCheckedChange?: (checked: boolean) => void;
}
