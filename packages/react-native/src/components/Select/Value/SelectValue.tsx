import { createSelectSlot } from '../internal/SelectCollection';
import type { SelectValueSlotProps } from '../types';

export const SelectValue = createSelectSlot<SelectValueSlotProps>(
  'value',
  'Select.Value'
);
