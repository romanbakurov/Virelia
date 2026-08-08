import type { Placement, Strategy } from '@floating-ui/react';
import type {
  BaseDropdownContentProps,
  BaseDropdownItemProps,
  BaseDropdownProps,
  BaseDropdownSearchProps,
  BaseDropdownSelectableItemProps,
  BaseDropdownTriggerProps,
} from '@vellira-ui/types';
import type {
  AnchorHTMLAttributes,
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react';

export type DropdownSelectEvent = {
  originalEvent:
    MouseEvent<HTMLElement> | KeyboardEvent | ReactKeyboardEvent<HTMLElement>;
  preventDefault: () => void;
  defaultPrevented: boolean;
};

export type DropdownProps = BaseDropdownProps & {
  children: ReactNode;
  placement?: Placement;
  strategy?: Strategy;
  offset?: number;
  collisionPadding?: number;
  matchTriggerWidth?: boolean;
  minWidth?: number | string;
  maxWidth?: number | string;
  portal?: boolean;
  avoidCollisions?: boolean;
  modal?: boolean;
  loop?: boolean;
  className?: string;
  loadingText?: ReactNode;
  empty?: ReactNode;
};

export type DropdownTriggerProps = BaseDropdownTriggerProps & {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
};

export type DropdownContentProps = BaseDropdownContentProps & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export type DropdownSearchProps = BaseDropdownSearchProps & {
  'aria-label'?: string;
  className?: string;
};

export type DropdownArrowProps = {
  className?: string;
};

export type DropdownItemProps = BaseDropdownItemProps & {
  children: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  shortcut?: ReactNode;
  onSelect?: (event: DropdownSelectEvent) => void;
  href?: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  rel?: string;
  download?: boolean | string;
  className?: string;
};

export type DropdownCheckboxItemProps = BaseDropdownSelectableItemProps & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  icon?: ReactNode;
  shortcut?: ReactNode;
  children: ReactNode;
  className?: string;
};

export type DropdownRadioGroupProps = {
  children?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export type DropdownRadioItemProps = BaseDropdownSelectableItemProps & {
  children: ReactNode;
  value: string;
  icon?: ReactNode;
  shortcut?: ReactNode;
  className?: string;
};

export type DropdownSeparatorProps = {
  className?: string;
};

export type DropdownSubProps = {
  children?: ReactNode;
};

export type DropdownSubTriggerProps = Omit<DropdownItemProps, 'onSelect'>;

export type DropdownSubContentProps = {
  children?: ReactNode;
  className?: string;
};

export type DropdownItemIconProps = {
  children?: ReactNode;
};

export type DropdownItemDescriptionProps = {
  children?: ReactNode;
};

export type DropdownItemBadgeProps = {
  children?: ReactNode;
};

export type DropdownItemShortcutProps = {
  children?: ReactNode;
};

export type DropdownGroupProps = {
  children?: ReactNode;
};

export type DropdownLabelProps = {
  children?: ReactNode;
  className?: string;
};

export type DropdownEmptyProps = {
  children?: ReactNode;
};

export type DropdownLoadingProps = {
  children?: ReactNode;
};
