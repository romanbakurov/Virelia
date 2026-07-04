import type { BaseModalFooterProps } from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';

import type { WebComponentProps } from '../../../types';

export interface ModalFooterProps
  extends BaseModalFooterProps, WebComponentProps<'div', 'children'> {
  children: ReactNode;
}
