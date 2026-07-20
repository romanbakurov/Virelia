import type { TooltipDelay } from '@vellira-ui/types';

import { useTooltipProviderContext } from './TooltipContext';
import type { TooltipDelayConfig } from './types';

export function useTooltipDelay(
  delay?: number | TooltipDelay,
  _skipDelay?: number
): TooltipDelayConfig {
  const provider = useTooltipProviderContext();

  if (delay == null) {
    return provider.delay;
  }

  if (typeof delay === 'number') {
    return {
      open: delay,
      close: provider.delay.close,
    };
  }

  return {
    open: delay.open ?? provider.delay.open,
    close: delay.close ?? provider.delay.close,
  };
}
