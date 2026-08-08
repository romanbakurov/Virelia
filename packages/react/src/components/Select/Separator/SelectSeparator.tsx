import type { SelectSeparatorProps } from '../Group/types';
import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

export const SelectSeparator: SelectSlotComponent<SelectSeparatorProps> = () =>
  null;

markSelectSlot(SelectSeparator, 'separator');
SelectSeparator.displayName = 'Select.Separator';
