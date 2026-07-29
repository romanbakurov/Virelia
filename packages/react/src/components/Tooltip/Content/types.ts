import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  forceMount?: boolean;
  withArrow?: boolean;
  className?: string;
  style?: CSSProperties;
}
