import { createDropdownSlot } from '../internal/DropdownCollection';
import type { DropdownSubTriggerProps } from '../types';

export const DropdownSubTrigger = createDropdownSlot<DropdownSubTriggerProps>(
  'subTrigger',
  'Dropdown.SubTrigger'
);
