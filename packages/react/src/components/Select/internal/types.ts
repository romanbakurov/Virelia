import type { ReactElement, ReactNode } from 'react';

import { resolveCompoundSlotPart } from '../../internal/compoundSlots';
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

export function markSelectSlot<P>(
  component: SelectSlotComponent<P>,
  part: SelectSlot
) {
  component.__velliraSelectPart = part;

  return component;
}

export function getSelectSlotPart(type: unknown): SelectSlot | undefined {
  return resolveCompoundSlotPart<SelectSlot>(type, '__velliraSelectPart');
}

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
      option: SelectOption;
      optionIndex: number;
    }
  | {
      type: 'separator';
      id: string;
    };
