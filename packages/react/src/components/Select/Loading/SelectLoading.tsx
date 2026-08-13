import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

import type { SelectLoadingProps } from './types';

export const SelectLoading: SelectSlotComponent<SelectLoadingProps> = ({
  children,
}) => <>{children}</>;

markSelectSlot(SelectLoading, 'loading');
SelectLoading.displayName = 'Select.Loading';
