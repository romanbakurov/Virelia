import type { BaseTabsProps } from '@vellira-ui/types';
import type { HTMLAttributes, ReactNode } from 'react';

type DivProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'color' | 'defaultValue' | 'dir' | 'onChange'
>;

export interface TabsProps extends BaseTabsProps, DivProps {
  /** Tab list and tab panel content. */
  children: ReactNode;
}
