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

type WrappedSelectSlotComponent = {
  __velliraSelectPart?: SelectSlot;
  render?: WrappedSelectSlotComponent;
  type?: WrappedSelectSlotComponent;
};

export function getSelectSlotPart(type: unknown): SelectSlot | undefined {
  const slotType = type as WrappedSelectSlotComponent | undefined;

  return (
    slotType?.__velliraSelectPart ??
    slotType?.type?.__velliraSelectPart ??
    slotType?.render?.__velliraSelectPart
  );
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
