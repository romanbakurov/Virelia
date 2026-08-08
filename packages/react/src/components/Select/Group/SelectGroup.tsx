import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

import type { SelectGroupProps } from './types';

export const SelectGroup: SelectSlotComponent<SelectGroupProps> = () => null;

markSelectSlot(SelectGroup, 'group');
SelectGroup.displayName = 'Select.Group';
