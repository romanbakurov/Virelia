import { useOverlayPresentation } from '@/hooks';

type SelectFloatingPlacement =
  | 'bottom'
  | 'top'
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'left'
  | 'left-start'
  | 'left-end';

interface UseSelectPositionParams {
  avoidCollisions: boolean;
  isOpen: boolean;
  matchTriggerWidth: boolean;
  onOpenChange: (open: boolean) => void;
  placement: SelectFloatingPlacement;
}

export function useSelectPosition({
  avoidCollisions,
  isOpen,
  matchTriggerWidth,
  onOpenChange,
  placement,
}: UseSelectPositionParams) {
  return useOverlayPresentation({
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
