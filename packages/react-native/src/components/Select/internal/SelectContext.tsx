import { createContext, useContext } from 'react';

import type { SelectContextValue } from './types';

export const SelectContext = createContext<SelectContextValue | null>(null);

export const useSelectContext = () => {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error('Select compound components must be used inside Select');
  }

  return context;
};
