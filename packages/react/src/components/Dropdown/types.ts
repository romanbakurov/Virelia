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
  /** Original pointer or keyboard event that selected the item. */
  originalEvent:
    MouseEvent<HTMLElement> | KeyboardEvent | ReactKeyboardEvent<HTMLElement>;
  /** Prevents the dropdown from performing its default select behavior. */
  preventDefault: () => void;
  /** Whether default select behavior has been prevented. */
  defaultPrevented: boolean;
};

export type DropdownProps = BaseDropdownProps & {
  /** Trigger, content, and optional compound dropdown children. */
  children: ReactNode;
  /** Floating content placement relative to the trigger. */
  placement?: Placement;
  /** CSS positioning strategy used by the floating content. */
  strategy?: Strategy;
  /** Distance between the trigger and dropdown content. */
  offset?: number;
  /** Padding used when avoiding viewport collisions. */
  collisionPadding?: number;
  /** Matches dropdown content width to the trigger width. */
  matchTriggerWidth?: boolean;
  /** Minimum dropdown content width. */
  minWidth?: number | string;
  /** Maximum dropdown content width. */
  maxWidth?: number | string;
  /** Renders dropdown content through a portal. */
  portal?: boolean;
  /** Allows the dropdown to flip or shift to stay visible. */
  avoidCollisions?: boolean;
  /** Uses modal interaction semantics while the dropdown is open. */
  modal?: boolean;
  /** Allows keyboard navigation to wrap between first and last items. */
  loop?: boolean;
  /** Class name applied to the root element. */
  className?: string;
  /** Content shown while dropdown items are loading. */
  loadingText?: ReactNode;
  /** Content shown when no items match the current query. */
  empty?: ReactNode;
};

export type DropdownTriggerProps = BaseDropdownTriggerProps & {
  /** Trigger content. */
  children: ReactNode;
  /** Composes trigger behavior onto a single child element. */
  asChild?: boolean;
  /** Class name applied to the trigger element. */
  className?: string;
};

export type DropdownContentProps = BaseDropdownContentProps & {
  /** Dropdown item and slot content. */
  children?: ReactNode;
  /** Class name applied to the content element. */
  className?: string;
  /** Inline style applied to the content element. */
  style?: CSSProperties;
};

export type DropdownSearchProps = BaseDropdownSearchProps & {
  /** Accessible name for the search input. */
  'aria-label'?: string;
  /** Class name applied to the search input. */
  className?: string;
};

export type DropdownArrowProps = {
  /** Class name applied to the floating arrow element. */
  className?: string;
};

export type DropdownItemProps = BaseDropdownItemProps & {
  /** Item label or custom item content. */
  children: ReactNode;
  /** Composes item behavior onto a single child element. */
  asChild?: boolean;
  /** Icon rendered before the item label. */
  icon?: ReactNode;
  /** Supporting text rendered below the item label. */
  description?: ReactNode;
  /** Badge content rendered after the item label. */
  badge?: ReactNode;
  /** Keyboard shortcut hint rendered after the item label. */
  shortcut?: ReactNode;
  /** Called when this item is selected. */
  onSelect?: (event: DropdownSelectEvent) => void;
  /** Link target rendered when the item acts as an anchor. */
  href?: string;
  /** Anchor target used when href is provided. */
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  /** Anchor rel attribute used when href is provided. */
  rel?: string;
  /** Anchor download attribute used when href is provided. */
  download?: boolean | string;
  /** Class name applied to the item element. */
  className?: string;
};

export type DropdownCheckboxItemProps = BaseDropdownSelectableItemProps & {
  /** Composes checkbox item behavior onto a single child element. */
  asChild?: boolean;
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial checked state for uncontrolled usage. */
  defaultChecked?: boolean;
  /** Called when the checked state changes. */
  onCheckedChange?: (checked: boolean) => void;
  /** Indicator icon shown when the item is checked. */
  icon?: ReactNode;
  /** Keyboard shortcut hint rendered after the item label. */
  shortcut?: ReactNode;
  /** Checkbox item label or custom content. */
  children: ReactNode;
  /** Class name applied to the checkbox item element. */
  className?: string;
};

export type DropdownRadioGroupProps = {
  /** Radio item children. */
  children?: ReactNode;
  /** Controlled selected radio value. */
  value?: string;
  /** Initial selected radio value for uncontrolled usage. */
  defaultValue?: string;
  /** Called when the selected radio value changes. */
  onValueChange?: (value: string) => void;
};

export type DropdownRadioItemProps = BaseDropdownSelectableItemProps & {
  /** Radio item label or custom content. */
  children: ReactNode;
  /** Composes radio item behavior onto a single child element. */
  asChild?: boolean;
  /** Value represented by this radio item. */
  value: string;
  /** Indicator icon shown when the item is selected. */
  icon?: ReactNode;
  /** Keyboard shortcut hint rendered after the item label. */
  shortcut?: ReactNode;
  /** Class name applied to the radio item element. */
  className?: string;
};

export type DropdownSeparatorProps = {
  /** Class name applied to the separator element. */
  className?: string;
};

export type DropdownSubProps = {
  /** Submenu trigger and content. */
  children?: ReactNode;
};

export type DropdownSubTriggerProps = Omit<DropdownItemProps, 'onSelect'>;

export type DropdownSubContentProps = {
  /** Submenu item and slot content. */
  children?: ReactNode;
  /** Class name applied to the submenu content element. */
  className?: string;
};

export type DropdownItemIconProps = {
  /** Icon slot content. */
  children?: ReactNode;
};

export type DropdownItemDescriptionProps = {
  /** Description slot content. */
  children?: ReactNode;
};

export type DropdownItemBadgeProps = {
  /** Badge slot content. */
  children?: ReactNode;
};

export type DropdownItemShortcutProps = {
  /** Shortcut slot content. */
  children?: ReactNode;
};

export type DropdownGroupProps = {
  /** Grouped dropdown items. */
  children?: ReactNode;
};

export type DropdownLabelProps = {
  /** Label content for a dropdown group. */
  children?: ReactNode;
  /** Class name applied to the label element. */
  className?: string;
};

export type DropdownEmptyProps = {
  /** Empty state content. */
  children?: ReactNode;
};

export type DropdownLoadingProps = {
  /** Loading state content. */
  children?: ReactNode;
};
