export type DropdownSize = 'sm' | 'md' | 'lg';

export interface BaseDropdownMenuItem {
  type?: 'item';
  value: string;
  label: string;
  disabled?: boolean;
  danger?: boolean;
}

export interface BaseDropdownGroup {
  type: 'group';
  label: string;
}

export interface BaseDropdownSeparator {
  type: 'separator';
}

export type BaseDropdownItem =
  BaseDropdownMenuItem | BaseDropdownGroup | BaseDropdownSeparator;

export interface BaseDropdownProps {
  items: BaseDropdownItem[];

  disabled?: boolean;
  size?: DropdownSize;

  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  onSelect?: (value: string) => void;
}

export interface BaseDropdownTriggerProps {
  isOpen: boolean;
  disabled?: boolean;
  size?: DropdownSize;
}

export type BaseDropdownGroupProps = BaseDropdownGroup;

export type BaseDropdownItemProps = BaseDropdownMenuItem & {
  active?: boolean;
};
