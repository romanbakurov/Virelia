export type DropdownSize = 'sm' | 'md' | 'lg';

export type DropdownColor =
  'primary' | 'neutral' | 'success' | 'warning' | 'danger';

export type DropdownItemColor =
  'default' | 'primary' | 'success' | 'warning' | 'danger';

export interface BaseDropdownProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  size?: DropdownSize;
  color?: DropdownColor;

  disabled?: boolean;
  loading?: boolean;

  closeOnSelect?: boolean;

  searchable?: boolean;
  command?: boolean;
  searchValue?: string;
  defaultSearchValue?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
}

export interface BaseDropdownTriggerProps {
  disabled?: boolean;
}

export interface BaseDropdownContentProps {
  command?: boolean;
}

export interface BaseDropdownSearchProps {
  placeholder?: string;
}

export interface BaseDropdownItemProps {
  color?: DropdownItemColor;
  disabled?: boolean;
  closeOnSelect?: boolean;
}

export interface BaseDropdownSelectableItemProps {
  disabled?: boolean;
  closeOnSelect?: boolean;
}
