import { forwardRef } from 'react';

import { cn } from '@utils/cn';

import { composeRefs } from '../internal/composeEventHandlers';
import { useTooltipContext } from '../internal/TooltipContext';

import type { TooltipContentProps } from './types';

import styles from './TooltipContent.module.scss';

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    {
      children,
      color = 'neutral',
      size = 'sm',
      forceMount = false,
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
        className={cn(styles.tooltip, styles[color], styles[size], className)}
        data-placement={tooltip.placement}
        data-state={tooltip.open ? 'open' : 'closed'}
        style={{
          ...tooltip.floatingStyles,
          ...style,
        }}
      >
        {children}
      </div>
    );
  }
);

TooltipContent.displayName = 'Tooltip.Content';
