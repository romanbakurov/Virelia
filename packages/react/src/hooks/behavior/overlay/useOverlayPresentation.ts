import type { Middleware, Placement, Strategy } from '@floating-ui/react';
import type { CSSProperties } from 'react';

import { useFloatingPosition } from '@/managers/FloatingManager';

export type OverlayPresentation = 'floating' | 'inline' | 'modal';
export type OverlayPresentationResult = ReturnType<
  typeof useFloatingPosition
> & {
  animationStyle?: CSSProperties;
  presentation: OverlayPresentation;
};

export type OverlayPresentationOptions = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  strategy?: Strategy;
  portal?: boolean;
  presentation?: OverlayPresentation;
  animationStyle?: CSSProperties;
  offset?: number;
  collisionPadding?: number;
  matchTriggerWidth?: boolean;
  avoidCollisions?: boolean;
  mobileSheetBreakpoint?: number;
  middleware?: Middleware[];
};

export const useOverlayPresentation = ({
  open,
  onOpenChange,
  placement = 'bottom-start',
  strategy,
  portal = true,
  presentation,
  animationStyle,
  offset,
  collisionPadding,
  matchTriggerWidth,
  avoidCollisions,
  mobileSheetBreakpoint,
  middleware,
}: OverlayPresentationOptions = {}) => {
  const floating = useFloatingPosition({
    open,
    onOpenChange,
    placement,
    strategy: strategy ?? (portal ? 'fixed' : 'absolute'),
    offset,
    collisionPadding,
    matchTriggerWidth,
    avoidCollisions,
    mobileSheetBreakpoint,
    middleware,
  });

  return {
    ...floating,
    animationStyle,
    presentation: presentation ?? (portal ? 'floating' : 'inline'),
  } satisfies OverlayPresentationResult;
};
