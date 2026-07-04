import { createContext, useContext } from 'react';

import type { TabsContextValue } from './types';

const TabsContext = createContext<TabsContextValue | null>(null);

export const TabsProvider = TabsContext.Provider;

export const useTabs = (): TabsContextValue => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('Tabs components must be used inside <Tabs>.');
  }

  return context;
};

TabsContext.displayName = 'TabsContext';
