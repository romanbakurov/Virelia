import type { ReactElement, ReactNode } from 'react';

import type { SelectOption } from '../types';

export type SelectSlot =
  | 'content'
  | 'empty'
  | 'group'
  | 'icon'
  | 'item'
  | 'itemBadge'
  | 'itemDescription'
  | 'itemIcon'
  | 'label'
  | 'loading'
  | 'search'
  | 'separator'
  | 'trigger'
  | 'value';

export type SelectSlotComponent<P> = ((props: P) => ReactElement | null) & {
  __velliraSelectPart?: SelectSlot;
  displayName?: string;
};

export type SelectRenderEntry =
  | {
      type: 'group';
      id: string;
      label: ReactNode;
    }
  | {
      type: 'option';
      option: SelectOption;
      optionIndex: number;
    }
  | {
      type: 'separator';
      id: string;
    };
