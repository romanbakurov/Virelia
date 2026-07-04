export type InputSize = 'sm' | 'md' | 'lg';
export type InputType =
  'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

export interface BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}
