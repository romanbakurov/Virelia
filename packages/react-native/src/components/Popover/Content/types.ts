import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';

export interface PopoverContentProps extends ViewProps {
  /** Popover content shown while open. */
  children: ReactNode;
}
