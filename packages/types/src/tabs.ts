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
  loop?: boolean;

  keepMounted?: boolean;
  lazyMount?: boolean;

  variant?: TabsVariant;
  color?: TabsColor;
  size?: TabsSize;
}

export interface BaseTabsListProps {
  scrollable?: boolean;
}

export interface BaseTabsTriggerProps {
  value: TabsValue;
  disabled?: boolean;
}

export interface BaseTabsContentProps {
  value: TabsValue;
  forceMount?: boolean;
}
