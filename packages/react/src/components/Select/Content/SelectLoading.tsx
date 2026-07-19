import type { ReactNode } from 'react';

import type { SelectSlotComponent } from '../internal/types';

export interface SelectLoadingProps {
  children?: ReactNode;
}

export const SelectLoading: SelectSlotComponent<SelectLoadingProps> = ({
  children,
}) => <>{children}</>;

SelectLoading.__velliraSelectPart = 'loading';
SelectLoading.displayName = 'Select.Loading';
