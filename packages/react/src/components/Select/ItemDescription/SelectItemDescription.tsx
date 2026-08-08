import type { ReactNode } from 'react';

import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

export interface SelectItemDescriptionProps {
  children?: ReactNode;
}

export const SelectItemDescription: SelectSlotComponent<
  SelectItemDescriptionProps
> = () => null;

markSelectSlot(SelectItemDescription, 'itemDescription');
SelectItemDescription.displayName = 'Select.ItemDescription';
