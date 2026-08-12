import type { FloatingArrow } from '@floating-ui/react';
import type { ComponentPropsWithoutRef } from 'react';

export type PopoverArrowAlign = 'start' | 'center' | 'end';

export interface PopoverArrowProps extends Omit<
  ComponentPropsWithoutRef<typeof FloatingArrow>,
  'context' | 'staticOffset'
> {
  /** Arrow alignment along the popover edge. */
  align?: PopoverArrowAlign;
  /** Arrow offset from the aligned edge. */
  offset?: number | string;
}
