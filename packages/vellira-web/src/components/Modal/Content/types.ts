import type { BaseModalContentProps } from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';

import type { WebComponentProps } from '../../../types';

export interface ModalContentProps
  extends BaseModalContentProps, WebComponentProps<'div', 'children'> {
  children: ReactNode;
}
