import type { BaseTooltipProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';

export interface TooltipRootProps extends Omit<
  BaseTooltipProps,
  'delay' | 'onOpenChange'
> {
  /** Compound tooltip children. */
  children: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Initial uncontrolled open state. */
  defaultOpen?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Open delay in milliseconds, or explicit open/close delays. */
  delay?: number | Partial<BaseTooltipProps['delay']>;
  /** Delay window for future sibling tooltip delay skipping. */
  skipDelay?: number;
  /** Distance between trigger and content in pixels. */
  offset?: number;
  /** Allows pointer interaction inside tooltip content. */
  interactive?: boolean;
  /** Reserved for automatic portal rendering in higher-level helpers. */
  portal?: boolean;
  /** Allows the tooltip to flip or shift to stay visible. */
  avoidCollisions?: boolean;
  /** Matches tooltip content width to the trigger width. */
  matchTriggerWidth?: boolean;
  /** Reserved for modal overlay semantics. Tooltip defaults to non-modal. */
  modal?: boolean;
}
