import { createDropdownSlot } from '../internal/DropdownCollection';
import type { DropdownRadioGroupProps } from '../types';

export const DropdownRadioGroup = createDropdownSlot<DropdownRadioGroupProps>(
  'radioGroup',
  'Dropdown.RadioGroup'
);
