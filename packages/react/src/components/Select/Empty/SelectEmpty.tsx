import type { ReactNode } from 'react';

import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

export interface SelectEmptyProps {
  /** Empty state content shown when no options match. */
  children?: ReactNode;
}

export const SelectEmpty: SelectSlotComponent<SelectEmptyProps> = ({
  children,
}) => <>{children}</>;

markSelectSlot(SelectEmpty, 'empty');
SelectEmpty.displayName = 'Select.Empty';
