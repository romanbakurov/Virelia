export type InputSize = 'sm' | 'md' | 'lg';
export type InputType =
  'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type InputAdornmentTone =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'muted'
  | 'inverse';

export interface BaseInputVisualProps {
  label?: string;
  placeholder?: string;

  size?: InputSize;

  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;

  clearable?: boolean;
  onClear?: () => void;

  error?: string;

  leftAdornmentTone?: InputAdornmentTone;
  rightAdornmentTone?: InputAdornmentTone;
}
