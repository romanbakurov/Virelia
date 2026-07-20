import { createContext, useContext } from 'react';

import type { RadioGroupContextValue } from './types';

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export const RadioGroupProvider = RadioGroupContext.Provider;

export function useRadioGroupContext() {
  return useContext(RadioGroupContext);
}
