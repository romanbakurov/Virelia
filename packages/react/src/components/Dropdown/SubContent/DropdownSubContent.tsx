import { createDropdownSlot } from '../internal/DropdownCollection';
import type { DropdownSubContentProps } from '../types';

export const DropdownSubContent = createDropdownSlot<DropdownSubContentProps>(
  'subContent',
  'Dropdown.SubContent'
);
