import type {
  BaseModalOverlayProps,
  BaseModalProps,
} from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';

import type { WebComponentProps } from '../../types';

export interface ModalOverlayProps
  extends
    BaseModalOverlayProps,
    WebComponentProps<'div', 'children' | 'onClick'> {
  children: ReactNode;
  zIndex?: number;
  animated?: boolean;
}

export interface ModalProps
  extends BaseModalProps, WebComponentProps<'div', 'children' | 'onClick'> {
  children: ReactNode;
}
