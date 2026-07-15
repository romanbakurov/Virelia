import type { BaseDropdownItemProps, TextWrap } from '@vellira-ui/types';
import type { ReactNode } from 'react';

export interface DropdownItemProps extends Pick<
  BaseDropdownItemProps,
  'value' | 'disabled' | 'active'
> {
  id?: string;
  label: ReactNode;
  children: ReactNode;
  icon?: ReactNode;
  danger?: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  shortcut?: string;
  textWrap?: TextWrap;
  className?: string;
}
