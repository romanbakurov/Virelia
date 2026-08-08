import type { ReactNode } from 'react';

import type { SelectSlotComponent } from '../internal/types';

export interface SelectItemDescriptionProps {
  children?: ReactNode;
}

export const SelectItemDescription: SelectSlotComponent<
  SelectItemDescriptionProps
> = () => null;

SelectItemDescription.__velliraSelectPart = 'itemDescription';
SelectItemDescription.displayName = 'Select.ItemDescription';
