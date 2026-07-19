import { createSelectSlot } from '../internal/SelectCollection';
import type { SelectIconSlotProps } from '../types';

export const SelectIcon = createSelectSlot<SelectIconSlotProps>(
  'icon',
  'Select.Icon'
);
