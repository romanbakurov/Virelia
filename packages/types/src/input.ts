export type InputSize = 'sm' | 'md' | 'lg';
export type InputType =
  'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

export interface BaseInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;

  label?: string;
  placeholder?: string;

  type?: InputType;
  size?: InputSize;

  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;

  autoFocus?: boolean;
  maxLength?: number;

  clearable?: boolean;
  onClear?: () => void;

  error?: string;
}
