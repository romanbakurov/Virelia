import { FloatingArrow } from '@floating-ui/react';

import { usePopoverContext } from '../Context';

import type { PopoverArrowProps } from './types';

import styles from './PopoverArrow.module.scss';

import { cn } from '#utils/cn';

const staticOffsetByAlign = {
  start: '20%',
  center: null,
  end: '80%',
} as const;

export function PopoverArrow({
  width = 14,
  height = 7,
  tipRadius = 1,
  align = 'center',
  offset,
  className,
  ...arrowProps
}: PopoverArrowProps) {
  const { arrowRef, floatingContext, placement } =
    usePopoverContext('Popover.Arrow');

  const staticOffset = offset ?? staticOffsetByAlign[align];
  const side = placement.split('-')[0];

  return (
    <FloatingArrow
      {...arrowProps}
      ref={arrowRef}
      context={floatingContext}
      width={width}
      height={height}
      tipRadius={tipRadius}
      staticOffset={staticOffset}
      fill='var(--surface-elevated)'
      stroke='var(--border-muted)'
      strokeWidth={1}
      data-side={side}
      className={cn(styles.arrow, className)}
    />
  );
}

PopoverArrow.displayName = 'Popover.Arrow';
