import { createSelectSlot } from '../internal/SelectCollection';
import type { SelectItemIconProps } from '../types';

export const SelectItemIcon = createSelectSlot<SelectItemIconProps>(
  'itemIcon',
  'Select.ItemIcon'
);
