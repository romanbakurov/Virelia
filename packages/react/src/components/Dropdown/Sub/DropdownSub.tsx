import { createDropdownSlot } from '../internal/DropdownCollection';
import type { DropdownSubProps } from '../types';

export const DropdownSub = createDropdownSlot<DropdownSubProps>(
  'sub',
  'Dropdown.Sub'
);
