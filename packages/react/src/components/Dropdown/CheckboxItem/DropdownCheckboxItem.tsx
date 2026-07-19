import { createDropdownSlot } from '../internal/DropdownCollection';
import type { DropdownCheckboxItemProps } from '../types';

export const DropdownCheckboxItem =
  createDropdownSlot<DropdownCheckboxItemProps>(
    'checkboxItem',
    'Dropdown.CheckboxItem'
  );
