import type { BaseModalHeaderProps } from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';

import type { WebComponentProps } from '../../../types';

export interface ModalHeaderProps
  extends BaseModalHeaderProps, WebComponentProps<'div', 'children'> {
  children: ReactNode;
}
