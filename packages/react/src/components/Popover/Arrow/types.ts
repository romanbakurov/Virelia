import type { FloatingArrow } from '@floating-ui/react';
import type { ComponentPropsWithoutRef } from 'react';

export type PopoverArrowAlign = 'start' | 'center' | 'end';

export interface PopoverArrowProps extends Omit<
  ComponentPropsWithoutRef<typeof FloatingArrow>,
  'context' | 'staticOffset'
> {
  align?: PopoverArrowAlign;
  offset?: number | string;
}
