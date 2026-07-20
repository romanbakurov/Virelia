import { createContext, useContext } from 'react';

import type { TooltipContextValue, TooltipDelayConfig } from './types';

const TooltipContext = createContext<TooltipContextValue | null>(null);

const TooltipProviderContext = createContext<{
  delay: TooltipDelayConfig;
  skipDelay: number;
}>({
  delay: { open: 300, close: 100 },
  skipDelay: 300,
});

export const TooltipRootProvider = TooltipContext.Provider;

export const TooltipProvider = ({
  children,
  delay = 700,
  skipDelay = 300,
}: {
  children: React.ReactNode;
  delay?: number | TooltipDelayConfig;
  skipDelay?: number;
}) => {
  const resolvedDelay =
    typeof delay === 'number' ? { open: delay, close: 100 } : delay;

  return (
    <TooltipProviderContext.Provider
      value={{ delay: resolvedDelay, skipDelay }}
    >
      {children}
    </TooltipProviderContext.Provider>
  );
};

export function useTooltipContext() {
  const context = useContext(TooltipContext);

  if (!context) {
    throw new Error(
      'Tooltip compound components must be rendered inside Tooltip'
    );
  }

  return context;
}

export function useTooltipProviderContext() {
  return useContext(TooltipProviderContext);
}
