import type { TooltipDelay } from '@vellira-ui/types';

export const resolveTooltipDelay = (
  delay?: number | Partial<TooltipDelay>
): TooltipDelay => {
  if (typeof delay === 'number') {
    return {
      open: delay,
      close: 2500,
    };
  }

  return {
    open: delay?.open ?? 0,
    close: delay?.close ?? 2500,
  };
};
