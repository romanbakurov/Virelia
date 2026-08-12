import type { ReactNode } from 'react';

import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

export interface SelectItemIconProps {
  /** Icon content for a select item. */
  children?: ReactNode;
}

export const SelectItemIcon: SelectSlotComponent<SelectItemIconProps> = () =>
  null;

markSelectSlot(SelectItemIcon, 'itemIcon');
SelectItemIcon.displayName = 'Select.ItemIcon';
