import type { ControlSize } from './common';

export type InputSize = ControlSize;
export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search';

export interface BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  size?: InputSize;
  disabled?: boolean;
  required?: boolean;
}
