import type { Placement } from '@floating-ui/react';
import type {
  BaseDropdownGroup,
  BaseDropdownMenuItem,
  BaseDropdownProps,
  BaseDropdownSeparator,
  TextWrap,
} from '@vellira-ui/types';
import type { ReactNode } from 'react';

export interface DropdownMenuItem extends Omit<BaseDropdownMenuItem, 'label'> {
  label: ReactNode;
  icon?: ReactNode;
  shortcut?: string;
}

export interface DropdownGroup extends Omit<BaseDropdownGroup, 'label'> {
  label: ReactNode;
}

export type DropdownSeparator = BaseDropdownSeparator;

export type DropdownItem = DropdownMenuItem | DropdownGroup | DropdownSeparator;

export interface DropdownProps extends Omit<BaseDropdownProps, 'items'> {
  label?: ReactNode;
  ariaLabel?: string;

  trigger?: ReactNode;
  icon?: ReactNode;
  arrowIcon?: ReactNode;

  items: DropdownItem[];

  placement?: Placement;
  matchTriggerWidth?: boolean;

  showArrow?: boolean;
  rotateAngle?: number;
  textWrap?: TextWrap;

  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
}

export const isMenuItem = (item: DropdownItem): item is DropdownMenuItem =>
  item.type === undefined || item.type === 'item';

export const isGroup = (item: DropdownItem): item is DropdownGroup =>
  item.type === 'group';

export const isSeparator = (item: DropdownItem): item is DropdownSeparator =>
  item.type === 'separator';
