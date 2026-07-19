import type { ReactNode } from 'react';

import type { SelectSlotComponent } from '../internal/types';

export interface SelectEmptyProps {
  children?: ReactNode;
}

export const SelectEmpty: SelectSlotComponent<SelectEmptyProps> = ({
  children,
}) => <>{children}</>;

SelectEmpty.__velliraSelectPart = 'empty';
SelectEmpty.displayName = 'Select.Empty';
