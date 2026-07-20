import type { CSSProperties, ReactNode } from 'react';

export type ModalContentSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalContentPlacement = 'center' | 'top';
export type ModalScrollBehavior = 'inside' | 'outside';

export interface ModalContentProps {
  children: ReactNode;
  size?: ModalContentSize;
  placement?: ModalContentPlacement;
  scrollBehavior?: ModalScrollBehavior;
  animated?: boolean;
  forceMount?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  className?: string;
  style?: CSSProperties;
}
