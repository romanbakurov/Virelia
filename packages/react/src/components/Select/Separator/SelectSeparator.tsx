import type { SelectSeparatorProps } from '../Group/types';
import type { SelectSlotComponent } from '../internal/types';

export const SelectSeparator: SelectSlotComponent<SelectSeparatorProps> = () =>
  null;

SelectSeparator.__velliraSelectPart = 'separator';
SelectSeparator.displayName = 'Select.Separator';
