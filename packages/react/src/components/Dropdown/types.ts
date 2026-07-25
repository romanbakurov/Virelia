import type { Placement } from '@floating-ui/react';
import type {
  AnchorHTMLAttributes,
  CSSProperties,
  MouseEvent,
  ReactNode,
} from 'react';

export type DropdownSize = 'sm' | 'md' | 'lg';
export type DropdownColor =
  'primary' | 'neutral' | 'success' | 'warning' | 'danger';
export type DropdownItemColor =
  'default' | 'primary' | 'success' | 'warning' | 'danger';

export type DropdownSelectEvent = {
  originalEvent:
    MouseEvent<HTMLElement> | KeyboardEvent | React.KeyboardEvent<HTMLElement>;
  preventDefault: () => void;
  defaultPrevented: boolean;
};

export type DropdownProps = {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: DropdownSize;
  /** Semantic palette for trigger, content, focus, and item interaction states. */
  color?: DropdownColor;
  placement?: Placement;
  offset?: number;
  matchTriggerWidth?: boolean;
  minWidth?: number | string;
  maxWidth?: number | string;
  portal?: boolean;
  avoidCollisions?: boolean;
  modal?: boolean;
  closeOnSelect?: boolean;
  loop?: boolean;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  loadingText?: ReactNode;
  searchable?: boolean;
  command?: boolean;
  searchValue?: string;
  defaultSearchValue?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  empty?: ReactNode;
  noOptionsText?: ReactNode;
};

export type DropdownTriggerProps = {
  children: ReactNode;
  asChild?: boolean;
  disabled?: boolean;
  className?: string;
};

export type DropdownContentProps = {
  children?: ReactNode;
  command?: boolean;
  className?: string;
  style?: CSSProperties;
};

export type DropdownSearchProps = {
  placeholder?: string;
  'aria-label'?: string;
  className?: string;
};

export type DropdownArrowProps = {
  className?: string;
};

export type DropdownItemProps = {
  children: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  shortcut?: ReactNode;
  /** Semantic item color. Use `danger` for destructive actions. */
  color?: DropdownItemColor;
  disabled?: boolean;
  closeOnSelect?: boolean;
  onSelect?: (event: DropdownSelectEvent) => void;
  href?: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  rel?: string;
  download?: boolean | string;
  className?: string;
};

export type DropdownCheckboxItemProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  closeOnSelect?: boolean;
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

export type DropdownRadioItemProps = {
  children: ReactNode;
  value: string;
  disabled?: boolean;
  closeOnSelect?: boolean;
  icon?: ReactNode;
  shortcut?: ReactNode;
  className?: string;
};

export type DropdownGroupProps = {
  children?: ReactNode;
};

export type DropdownLabelProps = {
  children?: ReactNode;
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

export type DropdownEmptyProps = {
  children?: ReactNode;
};

export type DropdownLoadingProps = {
  children?: ReactNode;
};
