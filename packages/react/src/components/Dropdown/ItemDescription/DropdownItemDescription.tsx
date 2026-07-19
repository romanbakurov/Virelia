import { createDropdownSlot } from '../internal/DropdownCollection';
import type { DropdownItemDescriptionProps } from '../types';

export const DropdownItemDescription =
  createDropdownSlot<DropdownItemDescriptionProps>(
    'itemDescription',
    'Dropdown.ItemDescription'
  );
