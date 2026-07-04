import { TabsList } from './List/TabsList';
import { TabsPanel } from './Panel/TabsPanel';
import { Tab } from './Tab/Tab';
import { TabsRoot } from './Tabs';

export type { TabsListProps } from './List/types';
export type { TabsPanelProps } from './Panel/types';
export type { TabProps } from './Tab/types';
export type { TabsProps } from './types';

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab,
  Panel: TabsPanel,
});

export { Tab, TabsList, TabsPanel };
