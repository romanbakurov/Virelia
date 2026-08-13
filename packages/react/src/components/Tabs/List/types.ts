import type { BaseTabsListProps } from '@vellira-ui/types';
import type {
  ComponentPropsWithoutRef,
  HTMLAttributes,
  ReactNode,
} from 'react';

export interface TabsIndicatorProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children'
> {
  /** Class name applied to the active tab indicator. */
  className?: string;
}

export interface TabsListProps
  extends BaseTabsListProps, Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Tab trigger children. */
  children: ReactNode;
}
