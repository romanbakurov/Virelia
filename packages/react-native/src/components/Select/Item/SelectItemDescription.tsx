import { createSelectSlot } from '../internal/SelectCollection';
import type { SelectItemDescriptionProps } from '../types';

export const SelectItemDescription =
  createSelectSlot<SelectItemDescriptionProps>(
    'itemDescription',
    'Select.ItemDescription'
  );
