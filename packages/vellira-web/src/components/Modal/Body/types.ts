import type { BaseModalBodyProps } from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';

import type { WebComponentProps } from '../../../types';

export interface ModalBodyProps
  extends BaseModalBodyProps, WebComponentProps<'div', 'children'> {
  children: ReactNode;
}
