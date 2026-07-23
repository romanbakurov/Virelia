import { createContext, useContext } from 'react';

import type { TabsContextValue } from './types';

export const TabsContext = createContext<TabsContextValue | null>(null);

export const useTabsContext = (): TabsContextValue => {
  const context = useContext(TabsContext);

  if (!context) throw new Error('Tabs components must be used inside Tabs');

  return context;
};
