import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Tooltip content shown while open. */
  children: ReactNode;
  /** Keeps tooltip content mounted when closed. */
  forceMount?: boolean;
  /** Renders a small arrow pointing at the trigger. */
  withArrow?: boolean;
  /** Class name applied to the tooltip content element. */
  className?: string;
  /** Inline style applied to the tooltip content element. */
  style?: CSSProperties;
}
