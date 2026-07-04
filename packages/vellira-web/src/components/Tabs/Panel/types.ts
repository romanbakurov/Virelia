import type { BaseTabsPanelProps } from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';

import type { WebComponentProps } from '../../../types';

export interface TabsPanelProps
  extends BaseTabsPanelProps, WebComponentProps<'div', 'children'> {
  children: ReactNode;
}
