import type { BaseSelectTriggerProps } from '@romanbakurov/vellira-types';
import type { KeyboardEvent, ReactNode, Ref } from 'react';

import type { WebComponentProps } from '../../../types';

export interface SelectTriggerProps
  extends
    BaseSelectTriggerProps,
    WebComponentProps<
      'button',
      | 'children'
      | 'disabled'
      | 'onChange'
      | 'onClick'
      | 'onKeyDown'
      | 'required'
      | 'size'
    > {
  displayText: ReactNode;
  isPlaceholder: boolean;
  errorId?: string;
  listboxId: string;
  activeIndex: number;
  ariaLabel?: string;
  error?: boolean | string;
  onClick: () => void;
  buttonRef: Ref<HTMLButtonElement>;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
}
