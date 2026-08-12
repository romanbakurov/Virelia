import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

import type { SelectEmptyProps } from './types';

export const SelectEmpty: SelectSlotComponent<SelectEmptyProps> = ({
  children,
}) => <>{children}</>;

markSelectSlot(SelectEmpty, 'empty');
SelectEmpty.displayName = 'Select.Empty';
