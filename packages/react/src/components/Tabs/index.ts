import { TabsList } from './List/TabsList';
import { TabsPanel } from './Panel/TabsPanel';
import { Tab } from './Tab/Tab';
import { Tabs as BaseTabs } from './Tabs';

export { TabsList } from './List/TabsList';
export type { TabsListProps } from './List/types';
export { TabsPanel } from './Panel/TabsPanel';
export type { TabsPanelProps } from './Panel/types';
export { Tab } from './Tab/Tab';
export type { TabProps } from './Tab/types';
export { useTabs } from './TabsContext';
export type { TabsProps } from './types';

export const Tabs = Object.assign(BaseTabs, {
  List: TabsList,
  Tab,
  Panel: TabsPanel,
});

export default Tabs;
