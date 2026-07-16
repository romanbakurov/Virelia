import type { RadioSize } from './radioGroup';
export type RadioValue = string;
export type RadioColor =
  'primary' | 'neutral' | 'success' | 'warning' | 'danger';

export interface BaseRadioProps {
  value: RadioValue;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  size?: RadioSize;
  color?: RadioColor;
  onCheckedChange?: (checked: boolean) => void;
}
