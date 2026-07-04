import type { Placement } from '@floating-ui/react';
import type {
  BaseDropdownGroup,
  BaseDropdownMenuItem,
  BaseDropdownProps,
  BaseDropdownSeparator,
  TextWrap,
} from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';

import type { WebComponentProps } from '../../types';

export interface DropdownMenuItem extends BaseDropdownMenuItem {
  icon?: ReactNode;
  danger?: boolean;
  shortcut?: string;
  textWrap?: TextWrap;
}

export type DropdownGroup = BaseDropdownGroup;
export type DropdownSeparator = BaseDropdownSeparator;
export type DropdownItem = DropdownMenuItem | DropdownGroup | DropdownSeparator;

export interface DropdownProps
  extends
    Omit<BaseDropdownProps, 'items'>,
    WebComponentProps<'button', 'children' | 'disabled' | 'onSelect'> {
  label?: string;
  trigger?: ReactNode;
  icon?: ReactNode;
  arrowIcon?: ReactNode;
  items: DropdownItem[];
  placement?: Placement;
  rotateAngle?: number;
  matchTriggerWidth?: boolean;
  showArrow?: boolean;
  textWrap?: TextWrap;
}

export const isMenuItem = (item: DropdownItem): item is DropdownMenuItem =>
  item.type !== 'group' && item.type !== 'separator';

export const isGroup = (item: DropdownItem): item is DropdownGroup =>
  item.type === 'group';

export const isSeparator = (item: DropdownItem): item is DropdownSeparator =>
  item.type === 'separator';
