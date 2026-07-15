import type { RadioValue } from './radio';

export type RadioGroupOrientation = 'vertical' | 'horizontal';
export type RadioSize = 'sm' | 'md' | 'lg';

export interface BaseRadioGroupProps {
  value?: RadioValue;
  defaultValue?: RadioValue;
  disabled?: boolean;
  required?: boolean;
  orientation?: RadioGroupOrientation;
  size?: RadioSize;
  onValueChange?: (value: RadioValue) => void;
}
