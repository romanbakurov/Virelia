import { createContext, useContext } from 'react';

export interface RegisteredTab {
  disabled?: boolean;
}

export interface TabsContextValue {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  orientation: 'horizontal' | 'vertical';
  appearance: 'default' | 'underline' | 'pills';

  registerTab: (index: number, el: HTMLButtonElement | null) => void;
  onTabKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
}

export const TabsContext = createContext<TabsContextValue | null>(null);

export const useTabs = (): TabsContextValue => {
  const context = useContext(TabsContext);

  if (!context) throw new Error('Tabs components must be used inside Tabs');

  return context;
};

export default TabsContext;
