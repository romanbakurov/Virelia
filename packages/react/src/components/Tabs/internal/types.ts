import type { Orientation, TabsAppearance } from '@vellira-ui/types';
import type { KeyboardEvent } from 'react';

export interface TabsContextValue {
  activeIndex: number;
  setActiveIndex: (index: number) => void;

  orientation: Orientation;
  appearance: TabsAppearance;

  registerTab: (index: number, element: HTMLButtonElement | null) => void;

  onTabKeyDown: (event: KeyboardEvent<HTMLElement>, index: number) => void;
}
