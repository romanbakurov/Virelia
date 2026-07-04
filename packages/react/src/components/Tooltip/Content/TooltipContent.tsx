import { forwardRef } from 'react';

import { cn } from '@utils/cn';

import type { TooltipContentProps } from './types';

import styles from './TooltipContent.module.scss';

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    {
      content,
      placement = 'top',
      arrowRef,
      arrowX,
      arrowY,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const side = placement.split('-')[0] as 'top' | 'right' | 'bottom' | 'left';

    const staticSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[side];

    const arrowStyles = {
      position: 'absolute' as const,
      pointerEvents: 'none' as const,
      left: arrowX != null ? `${arrowX}px` : '',
      top: arrowY != null ? `${arrowY}px` : '',
      [staticSide]: '-5px',
    };

    return (
      <div
        ref={ref}
        className={cn(styles.tooltip, className)}
        data-placement={placement}
        data-state='open'
        style={style}
        {...props}
      >
        {content}
        <div ref={arrowRef} className={styles.arrow} style={arrowStyles} />
      </div>
    );
  }
);

TooltipContent.displayName = 'TooltipContent';
