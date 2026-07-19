import { createContext, useContext } from 'react';

import type { SelectContentProps } from '../Content/types';
import type { SelectTriggerProps } from '../Trigger/types';

export interface SelectContextValue {
  triggerProps: SelectTriggerProps;
  contentProps: SelectContentProps;
}

const SelectContext = createContext<SelectContextValue | null>(null);

export const SelectProvider = SelectContext.Provider;

export function useSelectContext() {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error('Select compound components must be used inside <Select>');
  }

  return context;
}

SelectContext.displayName = 'SelectContext';
