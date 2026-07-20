import { cn } from '@utils/cn';

import { useTooltipContext } from '../internal/TooltipContext';

import type { TooltipArrowProps } from './types';

import styles from '../Content/TooltipContent.module.scss';

export const TooltipArrow = ({
  className,
  style,
  ...props
}: TooltipArrowProps) => {
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
      {...props}
      ref={tooltip.arrowRef}
      className={cn(styles.arrow, className)}
      style={{
        left: tooltip.arrowX != null ? `${tooltip.arrowX}px` : undefined,
        top: tooltip.arrowY != null ? `${tooltip.arrowY}px` : undefined,
        [staticSide]: '-5px',
        ...style,
      }}
    />
  );
};

TooltipArrow.displayName = 'Tooltip.Arrow';
