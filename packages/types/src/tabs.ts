import type { Orientation } from './common';

export type TabsValue = string;

export type TabsActivationMode = 'automatic' | 'manual';

export type TabsVariant = 'line' | 'pills' | 'segmented';

export type TabsColor =
  'primary' | 'neutral' | 'success' | 'warning' | 'danger';

export type TabsSize = 'sm' | 'md' | 'lg';

export interface BaseTabsProps {
  value?: TabsValue;
  defaultValue?: TabsValue;
  onValueChange?: (value: TabsValue) => void;

  orientation?: Orientation;
  activationMode?: TabsActivationMode;
  dir?: 'ltr' | 'rtl';
  loop?: boolean;

  keepMounted?: boolean;
  lazyMount?: boolean;
  scrollable?: boolean;

  variant?: TabsVariant;
  color?: TabsColor;
  size?: TabsSize;

  disabled?: boolean;
}

export interface BaseTabsListProps {
  scrollable?: boolean;
}

export interface BaseTabsTriggerProps {
  value: TabsValue;
  disabled?: boolean;
  description?: unknown;
  badge?: unknown;
}

export interface BaseTabsContentProps {
  value: TabsValue;
  forceMount?: boolean;
}
