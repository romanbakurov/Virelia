import type { Orientation } from './common';

export type TabsValue = string;

export type TabsActivationMode = 'automatic' | 'manual';

export type TabsVariant = 'line' | 'pills' | 'segmented';

export type TabsColor =
  'primary' | 'neutral' | 'success' | 'warning' | 'danger';

export type TabsSize = 'sm' | 'md' | 'lg';

export interface BaseTabsProps {
  /** Controlled selected tab value. */
  value?: TabsValue;
  /** Initial selected tab value for uncontrolled usage. */
  defaultValue?: TabsValue;
  /** Called when the selected tab value changes. */
  onValueChange?: (value: TabsValue) => void;

  /** Layout direction for tab triggers and keyboard navigation. */
  orientation?: Orientation;
  /** Controls whether focus automatically activates tabs or requires explicit selection. */
  activationMode?: TabsActivationMode;
  /** Text direction used for horizontal keyboard navigation. */
  dir?: 'ltr' | 'rtl';
  /** Allows keyboard navigation to wrap from last to first tab and back. */
  loop?: boolean;

  /** Keeps inactive tab panels mounted in the tree. */
  keepMounted?: boolean;
  /** Defers mounting tab panel content until first activation. */
  lazyMount?: boolean;

  /** Visual style for the tab list and triggers. */
  variant?: TabsVariant;
  /** Semantic color palette for active tab styling. */
  color?: TabsColor;
  /** Controls trigger and indicator sizing. */
  size?: TabsSize;

  /** Disables every tab trigger. */
  disabled?: boolean;
}

export interface BaseTabsListProps {
  /** Allows the tab list to scroll when triggers overflow. */
  scrollable?: boolean;
}

export interface BaseTabsTriggerProps {
  /** Tab value associated with this trigger. */
  value: TabsValue;
  /** Disables this tab trigger. */
  disabled?: boolean;
  /** Secondary content shown with the trigger label. */
  description?: unknown;
  /** Badge content shown with the trigger label. */
  badge?: unknown;
}

export interface BaseTabsContentProps {
  /** Tab value associated with this panel. */
  value: TabsValue;
  /** Keeps this panel mounted regardless of active state. */
  forceMount?: boolean;
}
