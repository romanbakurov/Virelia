import { createSelectSlot } from '../internal/SelectCollection';
import type { SelectLabelProps } from '../types';

export const SelectLabel = createSelectSlot<SelectLabelProps>(
  'label',
  'Select.Label'
);
