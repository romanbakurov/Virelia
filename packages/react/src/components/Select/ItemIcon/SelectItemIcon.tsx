import type { ReactNode } from 'react';

import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

export interface SelectItemIconProps {
  children?: ReactNode;
}

export const SelectItemIcon: SelectSlotComponent<SelectItemIconProps> = () =>
  null;

markSelectSlot(SelectItemIcon, 'itemIcon');
SelectItemIcon.displayName = 'Select.ItemIcon';
