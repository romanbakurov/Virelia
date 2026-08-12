import type { ReactNode } from 'react';

import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

export interface SelectItemBadgeProps {
  /** Badge content for a select item. */
  children?: ReactNode;
}

export const SelectItemBadge: SelectSlotComponent<SelectItemBadgeProps> = () =>
  null;

markSelectSlot(SelectItemBadge, 'itemBadge');
SelectItemBadge.displayName = 'Select.ItemBadge';
