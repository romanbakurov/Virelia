import type { ReactNode } from 'react';

export interface SelectGroupProps {
  children?: ReactNode;
  label: ReactNode;
  selectable?: boolean;
  selectLabel?: ReactNode;
}

export interface SelectLabelProps {
  children?: ReactNode;
}

export interface SelectSeparatorProps {
  children?: never;
}
