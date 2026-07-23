import type { TabsRootProps } from './Root';

export type TabsProps = TabsRootProps;

export type { TabsContentProps } from './Content';
export type { TabsListProps } from './List';
export type { TabsTriggerProps } from './Trigger';

// Временные legacy aliases
export type { TabsContentProps as TabsPanelProps } from './Content';
export type { TabsTriggerProps as TabProps } from './Trigger';
