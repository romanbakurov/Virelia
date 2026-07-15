import { createContext, useContext } from 'react';

import type { RadioSize, RadioValue } from '@vellira-ui/types';

export interface RadioGroupContextValue {
  value: RadioValue;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
  size: RadioSize;
  onValueChange: (value: RadioValue) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export const RadioGroupProvider = RadioGroupContext.Provider;

export function useRadioGroupContext() {
  return useContext(RadioGroupContext);
}
