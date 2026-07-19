import { createDropdownSlot } from '../internal/DropdownCollection';
import type { DropdownItemBadgeProps } from '../types';

export const DropdownItemBadge = createDropdownSlot<DropdownItemBadgeProps>(
  'itemBadge',
  'Dropdown.ItemBadge'
);
