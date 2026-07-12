export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface BaseCheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  indeterminate?: boolean;
  error?: string;
  size?: CheckboxSize;

  onCheckedChange?: (checked: boolean) => void;
}
