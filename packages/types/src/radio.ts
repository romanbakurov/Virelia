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
  /** Disables interaction. */
  disabled?: boolean;
  /** Marks the radio as required. */
  required?: boolean;
  /** Validation error rendered for invalid state. */
  error?: string;
  /** Radio control size. */
  size?: RadioSize;
  /** Selected radio color. */
  color?: RadioColor;
  /** Called when the standalone checked state changes. */
  onCheckedChange?: (checked: boolean) => void;
}
