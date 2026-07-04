import type { BaseTabProps } from '@romanbakurov/vellira-types';
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';

import type { WebComponentProps } from '../../../types';

export interface TabProps
  extends
    BaseTabProps,
    WebComponentProps<
      'button',
      'children' | 'disabled' | 'onClick' | 'onKeyDown'
    > {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement> | null) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement> | null) => void;
}
