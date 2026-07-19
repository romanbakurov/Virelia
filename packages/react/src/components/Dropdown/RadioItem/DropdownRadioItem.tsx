import { createDropdownSlot } from '../internal/DropdownCollection';
import type { DropdownRadioItemProps } from '../types';

export const DropdownRadioItem = createDropdownSlot<DropdownRadioItemProps>(
  'radioItem',
  'Dropdown.RadioItem'
);
