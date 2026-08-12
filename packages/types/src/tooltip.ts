import type { FloatingPlacement } from './common';

export interface TooltipDelay {
  /** Delay before opening the tooltip, in milliseconds. */
  open: number;
  /** Delay before closing the tooltip, in milliseconds. */
  close: number;
}

export interface BaseTooltipProps {
  /** Preferred placement for tooltip content relative to the trigger. */
  placement?: FloatingPlacement;
  /** Disables tooltip interaction and prevents it from opening. */
  disabled?: boolean;
  /** Open and close delays in milliseconds. */
  delay?: TooltipDelay;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
}
