import type { BaseTooltipContentProps } from '@vellira-ui/types';
import type React from 'react';
import type { ReactNode, RefObject } from 'react';

export interface TooltipContentProps extends BaseTooltipContentProps {
  content: ReactNode;
  placement: string;
  arrowX?: number | null;
  arrowY?: number | null;
  className?: string;
  id?: string;
  role?: string;
  arrowRef: RefObject<HTMLDivElement | null>;
  style?: React.CSSProperties;
}
