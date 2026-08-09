import { getCompoundSlot, markCompoundSlot } from '@vellira-ui/core';
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
  displayName?: string;
};

export function markSelectSlot<P>(
  component: SelectSlotComponent<P>,
  part: SelectSlot
) {
  return markCompoundSlot(component, part);
}

export function getSelectSlotPart(type: unknown): SelectSlot | undefined {
  return getCompoundSlot<SelectSlot>(type);
}

export type SelectCollectionOption = SelectOption & {
  asChild?: boolean;
  children?: ReactNode;
};

export type SelectRenderEntry =
  | {
      type: 'group';
      id: string;
      label: ReactNode;
      selectable?: boolean;
      selectLabel?: ReactNode;
      itemValues: string[];
    }
  | {
      type: 'option';
      option: SelectCollectionOption;
      optionIndex: number;
    }
  | {
      type: 'separator';
      id: string;
    };
