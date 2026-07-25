import { TabsContent } from './Content/TabsContent';
import { TabsIndicator } from './List/TabsIndicator';
import { TabsList } from './List/TabsList';
import { TabsBadge } from './Trigger/TabsBadge';
import { TabsIcon } from './Trigger/TabsIcon';
import { TabsTrigger } from './Trigger/TabsTrigger';
import { TabsRoot } from './Root';

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
  Indicator: TabsIndicator,
  Icon: TabsIcon,
  Badge: TabsBadge,
});

Tabs.displayName = 'Tabs';
