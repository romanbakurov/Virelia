import { useFloatingPosition } from '@/managers/FloatingManager';

import type { SelectProps } from '../types';

interface UseSelectPositionParams {
  avoidCollisions: boolean;
  isOpen: boolean;
  matchTriggerWidth: boolean;
  onOpenChange: (open: boolean) => void;
  placement: NonNullable<SelectProps['placement']>;
}

export function useSelectPosition({
  avoidCollisions,
  isOpen,
  matchTriggerWidth,
  onOpenChange,
  placement,
}: UseSelectPositionParams) {
  return useFloatingPosition({
    open: isOpen,
    onOpenChange,
    placement:
      placement === 'bottom' || placement === 'top'
        ? `${placement}-start`
        : placement,
    matchTriggerWidth,
    avoidCollisions,
    mobileSheetBreakpoint: 640,
  });
}
