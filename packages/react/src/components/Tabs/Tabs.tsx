import { TabsContent } from './Content';
import { TabsIndicator, TabsList } from './List';
import { TabsRoot } from './Root';
import { TabsBadge, TabsIcon, TabsTrigger } from './Trigger';

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
  Indicator: TabsIndicator,
  Icon: TabsIcon,
  Badge: TabsBadge,
});

Tabs.displayName = 'Tabs';
