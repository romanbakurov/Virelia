import type { ReactNode } from 'react';

import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

export interface SelectLoadingProps {
  children?: ReactNode;
}

export const SelectLoading: SelectSlotComponent<SelectLoadingProps> = ({
  children,
}) => <>{children}</>;

markSelectSlot(SelectLoading, 'loading');
SelectLoading.displayName = 'Select.Loading';
