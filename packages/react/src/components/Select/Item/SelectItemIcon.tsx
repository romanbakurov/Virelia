import type { ReactNode } from 'react';

import type { SelectSlotComponent } from '../internal/types';

export interface SelectItemIconProps {
  children?: ReactNode;
}

export const SelectItemIcon: SelectSlotComponent<SelectItemIconProps> = () =>
  null;

SelectItemIcon.__velliraSelectPart = 'itemIcon';
SelectItemIcon.displayName = 'Select.ItemIcon';
