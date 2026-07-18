import { createContext, useContext } from 'react';

import type { SelectDropdownProps } from './SelectDropdown/types';
import type { SelectTriggerProps } from './SelectTrigger/types';

export interface SelectContextValue {
  triggerProps: SelectTriggerProps;
  dropdownProps: SelectDropdownProps;
}

const SelectContext = createContext<SelectContextValue | null>(null);

export const SelectProvider = SelectContext.Provider;

export function useSelectContext() {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error('Select compound components must be used inside Select');
  }

  return context;
}

SelectContext.displayName = 'SelectContext';
