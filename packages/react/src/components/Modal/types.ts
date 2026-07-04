import type { BaseModalOverlayProps, BaseModalProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';

export interface ModalOverlayProps extends BaseModalOverlayProps {
  children: ReactNode;
  className?: string;
  zIndex?: number;
  animated?: boolean;
}

export interface ModalProps extends BaseModalProps {
  children: ReactNode;
}
