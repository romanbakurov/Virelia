import type { RadioSize } from './radioGroup';
export type RadioValue = string;

export interface BaseRadioProps {
  value: RadioValue;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  size?: RadioSize;
  onCheckedChange?: (checked: boolean) => void;
}
