import type { DropdownItemColor, TextWrap } from '@vellira-ui/types';
import type { ReactNode } from 'react';

export interface DropdownItemProps {
  value: string;
  color?: DropdownItemColor;
  disabled?: boolean;
  label: ReactNode;
  icon?: ReactNode;
  textWrap?: TextWrap;
  onSelect: (value: string) => void;
}
