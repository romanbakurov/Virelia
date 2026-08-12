import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

import type { SelectItemIconProps } from './types';

export const SelectItemIcon: SelectSlotComponent<SelectItemIconProps> = () =>
  null;

markSelectSlot(SelectItemIcon, 'itemIcon');
SelectItemIcon.displayName = 'Select.ItemIcon';
