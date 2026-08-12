import type { BaseTabsListProps } from '@vellira-ui/types';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface TabsListProps
  extends BaseTabsListProps, Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Tab trigger children. */
  children: ReactNode;
}
