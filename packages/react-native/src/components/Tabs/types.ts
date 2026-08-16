import type {
  BaseTabsProps,
  Orientation,
  TabsColor,
  TabsMode,
  TabsSize,
  TabsValue,
  TabsVariant,
} from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface TabsProps extends Omit<
  BaseTabsProps,
  'activationMode' | 'dir' | 'loop'
> {
  /** Tab list and tab panel content. */
  children: ReactNode;
  /** Style applied to the root container. */
  style?: StyleProp<ViewStyle>;
}

export interface RegisteredTab {
  value: TabsValue;
  disabled: boolean;
}

export interface TabsTriggerLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TabsContextValue {
  value?: TabsValue;
  setValue: (value: TabsValue) => void;
  mode: TabsMode;
  orientation: Orientation;
  variant: TabsVariant;
  color: TabsColor;
  size: TabsSize;
  keepMounted: boolean;
  lazyMount: boolean;
  disabled: boolean;
  registerTrigger: (
    value: TabsValue,
    disabled: boolean,
    mounted: boolean
  ) => void;
  indicatorVersion: number;
  getTriggerLayout: (value: TabsValue) => TabsTriggerLayout | undefined;
  registerTriggerLayout: (
    value: TabsValue,
    layout: TabsTriggerLayout | undefined
  ) => void;
}
