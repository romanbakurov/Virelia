import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  color?: 'neutral';
  size?: 'sm';
  forceMount?: boolean;
  className?: string;
  style?: CSSProperties;
}
