import type { Orientation } from './common';

export type TabsAppearance = 'default' | 'underline' | 'pills';

export interface BaseTabsProps {
  activeIndex?: number;
  defaultActiveIndex?: number;
  onChange?: (index: number) => void;
  orientation?: Orientation;
  appearance?: TabsAppearance;
}

export type BaseTabsListProps = Record<never, never>;

export interface BaseTabsPanelProps {
  index: number;
}

export interface BaseTabProps {
  index: number;
  disabled?: boolean;
}
