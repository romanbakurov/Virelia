export type DropdownSize = 'sm' | 'md' | 'lg';

export type DropdownColor =
  'primary' | 'neutral' | 'success' | 'warning' | 'danger';

export type DropdownItemColor =
  'default' | 'primary' | 'success' | 'warning' | 'danger';

export interface BaseDropdownProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;

  /** Controls the trigger and item size. */
  size?: DropdownSize;
  /** Semantic color palette for the dropdown trigger and active items. */
  color?: DropdownColor;

  /** Disables trigger interaction. */
  disabled?: boolean;
  /** Shows loading content instead of regular items. */
  loading?: boolean;

  /** Controls whether the dropdown closes after an item is selected. */
  closeOnSelect?: boolean;

  /** Enables filtering through a search field. */
  searchable?: boolean;
  /** Enables command-style keyboard and search behavior. */
  command?: boolean;
  /** Controlled search query. */
  searchValue?: string;
  /** Initial search query for uncontrolled usage. */
  defaultSearchValue?: string;
  /** Placeholder shown in the search field. */
  searchPlaceholder?: string;
  /** Called when the search query changes. */
  onSearch?: (value: string) => void;
}

export interface BaseDropdownTriggerProps {
  /** Disables trigger interaction. */
  disabled?: boolean;
}

export interface BaseDropdownContentProps {
  /** Enables command-style content behavior. */
  command?: boolean;
}

export interface BaseDropdownSearchProps {
  /** Placeholder shown in the search field. */
  placeholder?: string;
}

export interface BaseDropdownItemProps {
  /** Semantic color palette for the item. */
  color?: DropdownItemColor;
  /** Disables item interaction. */
  disabled?: boolean;
  /** Overrides whether selecting this item closes the dropdown. */
  closeOnSelect?: boolean;
}

export interface BaseDropdownSelectableItemProps {
  /** Disables item interaction. */
  disabled?: boolean;
  /** Overrides whether selecting this item closes the dropdown. */
  closeOnSelect?: boolean;
}
