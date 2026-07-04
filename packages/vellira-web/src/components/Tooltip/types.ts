import type { BaseTooltipProps } from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';

import type { WebComponentProps } from '../../types';

export interface TooltipProps
  extends BaseTooltipProps, WebComponentProps<'div', 'children' | 'content'> {
  content: ReactNode;
  children: ReactNode;
  maxWidth?: number | string;
}
