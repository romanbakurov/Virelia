import type { ReactNode } from 'react';

import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

export interface SelectEmptyProps {
  children?: ReactNode;
}

export const SelectEmpty: SelectSlotComponent<SelectEmptyProps> = ({
  children,
}) => <>{children}</>;

markSelectSlot(SelectEmpty, 'empty');
SelectEmpty.displayName = 'Select.Empty';
