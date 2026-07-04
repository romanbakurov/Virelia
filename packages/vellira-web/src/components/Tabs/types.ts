import type { BaseTabsProps } from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';

import type { WebComponentProps } from '../../types';

export interface TabsProps
  extends BaseTabsProps, WebComponentProps<'div', 'onChange'> {
  children: ReactNode;
}
