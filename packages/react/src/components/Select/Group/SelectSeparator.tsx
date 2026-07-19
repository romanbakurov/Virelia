import type { SelectSlotComponent } from '../internal/types';

import type { SelectSeparatorProps } from './types';

export const SelectSeparator: SelectSlotComponent<SelectSeparatorProps> = () =>
  null;

SelectSeparator.__velliraSelectPart = 'separator';
SelectSeparator.displayName = 'Select.Separator';
