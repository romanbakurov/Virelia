import { useRef } from 'react';

import { arrow } from '@floating-ui/react';

import type { TooltipRootProps } from '../Root/types';

import { useOverlayPresentation } from '#hooks';

export function useTooltipPosition({
  open,
  onOpenChange,
  placement,
  offset,
  avoidCollisions,
  matchTriggerWidth,
}: Pick<
  TooltipRootProps,
  'placement' | 'offset' | 'avoidCollisions' | 'matchTriggerWidth'
> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const arrowRef = useRef<HTMLDivElement | null>(null);
  const floating = useOverlayPresentation({
    open,
    onOpenChange,
    placement,
    offset,
    avoidCollisions,
    matchTriggerWidth,
    middleware: [
      arrow({
        element: arrowRef,
      }),
    ],
  });

  return {
    ...floating,
    arrowRef,
    arrowX: floating.middlewareData.arrow?.x,
    arrowY: floating.middlewareData.arrow?.y,
  };
}
