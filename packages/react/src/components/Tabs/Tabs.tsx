import { TabsContent } from './Content';
import { TabsList } from './List';
import { TabsRoot } from './Root';
import { TabsTrigger } from './Trigger';

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,

  // Временная legacy-совместимость:
  Tab: TabsTrigger,
  Panel: TabsContent,
});

Tabs.displayName = 'Tabs';
