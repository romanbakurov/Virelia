import { createSelectSlot } from '../internal/SelectCollection';
import type { SelectItemBadgeProps } from '../types';

export const SelectItemBadge = createSelectSlot<SelectItemBadgeProps>(
  'itemBadge',
  'Select.ItemBadge'
);
