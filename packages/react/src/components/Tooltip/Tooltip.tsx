import { useId, useRef, useState } from 'react';

import {
  arrow,
  FloatingPortal,
  useFocus,
  useHover,
  useInteractions,
} from '@floating-ui/react';
import { useFloatingPosition } from '@hooks/useFloatingPosition';

import { TooltipContent } from './Content/TooltipContent';
import type { TooltipProps } from './types';

export const Tooltip = ({
  children,
  placement = 'top',
  content,
  disabled = false,
  delay = { open: 300, close: 100 },
  maxWidth = 250,
  className,
  onOpenChange,
}: TooltipProps) => {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<HTMLDivElement | null>(null);
  const tooltipId = useId();

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) return;

    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const {
    context,
    floatingStyles,
    middlewareData,
    setRef,
    setFloatingRef,
    placement: resolvedPlacement,
  } = useFloatingPosition({
    open,
    onOpenChange: handleOpenChange,
    placement,
    middleware: [
      arrow({
        element: arrowRef,
      }),
    ],
  });

  const arrowX = middlewareData.arrow?.x;
  const arrowY = middlewareData.arrow?.y;

  const hover = useHover(context, {
    delay: {
      open: delay.open,
      close: delay.close,
    },
  });
  const focus = useFocus(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
  ]);

  return (
    <>
      <div
        ref={setRef}
        style={{ display: 'inline-flex' }}
        aria-describedby={open ? tooltipId : undefined}
        {...getReferenceProps()}
      >
        {children}
      </div>

      <FloatingPortal>
        {open && content && (
          <TooltipContent
            id={tooltipId}
            ref={setFloatingRef}
            content={content}
            arrowRef={arrowRef}
            arrowX={arrowX}
            arrowY={arrowY}
            role='tooltip'
            style={{
              ...floatingStyles,
              maxWidth:
                typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
            }}
            placement={resolvedPlacement}
            className={className}
            {...getFloatingProps()}
          />
        )}
      </FloatingPortal>
    </>
  );
};

Tooltip.displayName = 'Tooltip';
