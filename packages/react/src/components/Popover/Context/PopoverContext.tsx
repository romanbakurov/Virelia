import { createContext, useContext } from 'react';

import type { PopoverContextValue } from './types';

const PopoverContext = createContext<PopoverContextValue | null>(null);

export function PopoverProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: PopoverContextValue;
}) {
  return (
    <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
  );
}

export function usePopoverContext(componentName: string) {
  const context = useContext(PopoverContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Popover.Root`);
  }

  return context;
}
