import { createContext, useContext } from 'react';

import type { DropdownContextValue } from './types';

const DropdownContext = createContext<DropdownContextValue | null>(null);

export const DropdownProvider = DropdownContext.Provider;

export const useDropdownContext = (): DropdownContextValue => {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error('Dropdown components must be used inside Dropdown');
  }

  return context;
};

DropdownContext.displayName = 'DropdownContext';
