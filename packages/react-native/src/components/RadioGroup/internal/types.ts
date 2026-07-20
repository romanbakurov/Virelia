import type { RadioColor, RadioSize, RadioValue } from '@vellira-ui/types';

export type RadioGroupOrientation = 'horizontal' | 'vertical';

export interface RadioGroupContextValue {
  value: RadioValue;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
  size: RadioSize;
  color: RadioColor;
  onValueChange: (value: RadioValue) => void;
}
