import { createDropdownSlot } from '../internal/DropdownCollection';
import type { DropdownSearchProps } from '../types';

export const DropdownSearch = createDropdownSlot<DropdownSearchProps>(
  'search',
  'Dropdown.Search'
);
