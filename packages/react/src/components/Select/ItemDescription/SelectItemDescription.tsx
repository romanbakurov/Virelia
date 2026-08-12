import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

import type { SelectItemDescriptionProps } from './types';

export const SelectItemDescription: SelectSlotComponent<
  SelectItemDescriptionProps
> = () => null;

markSelectSlot(SelectItemDescription, 'itemDescription');
SelectItemDescription.displayName = 'Select.ItemDescription';
