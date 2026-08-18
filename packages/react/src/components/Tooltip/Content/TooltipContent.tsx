import { forwardRef } from 'react';

import { composeRefs } from '../internal/composeEventHandlers';
import { useTooltipContext } from '../internal/TooltipContext';

import type { TooltipContentProps } from './types';

import styles from './TooltipContent.module.scss';

import { cn } from '#utils/cn';

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    {
      children,
      forceMount = false,
      withArrow = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const tooltip = useTooltipContext();

    if (!forceMount && !tooltip.open) {
      return null;
    }

    const contentProps = tooltip.getContentProps({
      id: tooltip.contentId,
      role: 'tooltip',
      ...props,
    });

    return (
      <div
        {...contentProps}
        ref={composeRefs(ref, tooltip.setContentRef)}
        className={cn(styles.tooltip, className)}
        data-placement={tooltip.placement}
        data-state={tooltip.open ? 'open' : 'closed'}
        style={{
          ...tooltip.floatingStyles,
          ...style,
        }}
      >
        {children}
        {withArrow && <InternalArrow />}
      </div>
    );
  }
);

TooltipContent.displayName = 'Tooltip.Content';

function InternalArrow() {
  const tooltip = useTooltipContext();
  const side = tooltip.placement.split('-')[0] as
    'top' | 'right' | 'bottom' | 'left';
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[side];

  return (
    <div
      ref={tooltip.arrowRef}
      className={styles.arrow}
      style={{
        left: tooltip.arrowX != null ? `${tooltip.arrowX}px` : undefined,
        top: tooltip.arrowY != null ? `${tooltip.arrowY}px` : undefined,
        [staticSide]: 'calc(var(--tooltip-arrow-size) / -2)',
      }}
    />
  );
}
