import type { RadioColor, RadioSize, RadioValue } from '@vellira-ui/types';

export type RadioGroupOrientation = 'horizontal' | 'vertical';

export interface RadioGroupContextValue {
  name: string;
  value: RadioValue;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
  size: RadioSize;
  color: RadioColor;
  describedBy?: string;
  onValueChange: (value: RadioValue) => void;
}
