import type { ReactNode } from 'react';

import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

export interface SelectItemDescriptionProps {
  /** Supporting description content for a select item. */
  children?: ReactNode;
}

export const SelectItemDescription: SelectSlotComponent<
  SelectItemDescriptionProps
> = () => null;

markSelectSlot(SelectItemDescription, 'itemDescription');
SelectItemDescription.displayName = 'Select.ItemDescription';
