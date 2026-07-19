import { createDropdownSlot } from '../internal/DropdownCollection';
import type { DropdownItemIconProps } from '../types';

export const DropdownItemIcon = createDropdownSlot<DropdownItemIconProps>(
  'itemIcon',
  'Dropdown.ItemIcon'
);
