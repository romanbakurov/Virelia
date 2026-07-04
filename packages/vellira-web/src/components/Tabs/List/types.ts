import type { BaseTabsListProps } from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';

import type { WebComponentProps } from '../../../types';

export interface TabsListProps
  extends BaseTabsListProps, WebComponentProps<'div', 'children'> {
  children: ReactNode;
}
