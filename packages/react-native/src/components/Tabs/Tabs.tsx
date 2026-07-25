import { TabsContent } from './Content/TabsContent';
import { TabsList } from './List/TabsList';
import { TabsTrigger } from './Trigger/TabsTrigger';
import { TabsRoot } from './Root';

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

Tabs.displayName = 'Tabs';
