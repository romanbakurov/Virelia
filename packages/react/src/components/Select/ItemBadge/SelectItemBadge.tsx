import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

import type { SelectItemBadgeProps } from './types';

export const SelectItemBadge: SelectSlotComponent<SelectItemBadgeProps> = () =>
  null;

markSelectSlot(SelectItemBadge, 'itemBadge');
SelectItemBadge.displayName = 'Select.ItemBadge';
