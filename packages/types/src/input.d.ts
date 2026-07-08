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
//# sourceMappingURL=input.d.ts.map
