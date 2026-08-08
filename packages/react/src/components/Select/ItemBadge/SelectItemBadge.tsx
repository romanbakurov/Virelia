import type { ReactNode } from 'react';

import type { SelectSlotComponent } from '../internal/types';

export interface SelectItemBadgeProps {
  children?: ReactNode;
}

export const SelectItemBadge: SelectSlotComponent<SelectItemBadgeProps> = () =>
  null;

SelectItemBadge.__velliraSelectPart = 'itemBadge';
SelectItemBadge.displayName = 'Select.ItemBadge';
