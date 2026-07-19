import type { SelectSlotComponent } from '../internal/types';

import type { SelectGroupProps } from './types';

export const SelectGroup: SelectSlotComponent<SelectGroupProps> = () => null;

SelectGroup.__velliraSelectPart = 'group';
SelectGroup.displayName = 'Select.Group';
