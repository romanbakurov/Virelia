import { createContext, useContext } from 'react';

import type { TooltipContextValue } from './types';

const TooltipContext = createContext<TooltipContextValue | null>(null);

export const TooltipProvider = TooltipContext.Provider;

export const useTooltipContext = (): TooltipContextValue => {
  const context = useContext(TooltipContext);

  if (!context) {
    throw new Error('Tooltip components must be used inside <Tooltip>.');
  }

  return context;
};

TooltipContext.displayName = 'TooltipContext';
