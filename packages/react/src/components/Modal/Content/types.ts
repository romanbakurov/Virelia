import type { BaseModalContentProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';

export interface ModalContentProps extends BaseModalContentProps {
  children: ReactNode;
}
