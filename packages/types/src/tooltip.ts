import type { FloatingPlacement } from './common';

export interface TooltipDelay {
  open: number;
  close: number;
}

export interface BaseTooltipProps {
  placement?: FloatingPlacement;
  disabled?: boolean;
  delay?: TooltipDelay;
  onOpenChange?: (open: boolean) => void;
}

export type BaseTooltipContentProps = Record<never, never>;
