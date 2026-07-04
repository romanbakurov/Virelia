import type {
  BaseTabsProps,
  Orientation,
  TabsAppearance,
} from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';

import type { NativeComponentProps } from '../../types';

export interface TabsProps extends BaseTabsProps, NativeComponentProps {
  children: ReactNode;
  appearance?: TabsAppearance;
}

export interface TabsContextValue {
  activeIndex: number;
  appearance: TabsAppearance;
  orientation: Orientation;
  setActiveIndex: (index: number) => void;
}
