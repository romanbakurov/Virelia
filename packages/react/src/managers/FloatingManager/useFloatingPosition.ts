import { useEffect, useMemo, useState } from 'react';

import type { Middleware, Placement, Strategy } from '@floating-ui/react';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from '@floating-ui/react';

interface UseFloatingPositionProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  strategy?: Strategy;
  offset?: number;
  collisionPadding?: number;
  matchTriggerWidth?: boolean;
  avoidCollisions?: boolean;
  mobileSheetBreakpoint?: number;
  middleware?: Middleware[];
}

export interface UseFloatingPositionReturn {
  context: ReturnType<typeof useFloating>['context'];
  placement: Placement;
  middlewareData: ReturnType<typeof useFloating>['middlewareData'];
  floatingStyles: ReturnType<typeof useFloating>['floatingStyles'];
  isMobileSheet: boolean;
  setRef: ReturnType<typeof useFloating>['refs']['setReference'];
  setFloatingRef: ReturnType<typeof useFloating>['refs']['setFloating'];
  updatePosition: ReturnType<typeof useFloating>['update'];
}

export const useMaxWidthMatch = (maxWidth?: number): boolean => {
  const getMatches = () => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function' ||
      !maxWidth
    ) {
      return false;
    }

    return window.matchMedia(`(max-width: ${maxWidth}px)`).matches;
  };

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function' ||
      !maxWidth
    ) {
      return undefined;
    }

    const mediaQuery = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const handleChange = () => setMatches(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [maxWidth]);

  return matches;
};

export const useFloatingPosition = ({
  open,
  onOpenChange,
  placement: initialPlacement = 'bottom-start',
  strategy = 'fixed',
  offset: offsetValue = 2,
  collisionPadding = 8,
  matchTriggerWidth = false,
  avoidCollisions = true,
  mobileSheetBreakpoint,
  middleware: customMiddleware = [],
}: UseFloatingPositionProps = {}): UseFloatingPositionReturn => {
  const isMobileSheet = useMaxWidthMatch(mobileSheetBreakpoint);

  const middleware: Middleware[] = useMemo(
    () => [
      offset(offsetValue),

      ...(avoidCollisions
        ? [
            flip({
              padding: collisionPadding,
            }),
          ]
        : []),

      size({
        apply({ rects, elements }) {
          if (!matchTriggerWidth || isMobileSheet) return;

          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),

      ...(avoidCollisions
        ? [
            shift({
              padding: collisionPadding,
            }),
          ]
        : []),

      ...customMiddleware,
    ],
    [
      avoidCollisions,
      collisionPadding,
      customMiddleware,
      isMobileSheet,
      matchTriggerWidth,
      offsetValue,
    ]
  );

  const {
    refs,
    floatingStyles,
    isPositioned,
    update,
    context,
    middlewareData,
    placement: resolvedPlacement,
  } = useFloating({
    open,
    onOpenChange,
    placement: initialPlacement,
    strategy,
    transform: false,
    middleware,
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (!isMobileSheet) return;

    refs.floating.current?.style.removeProperty('width');
  }, [isMobileSheet, refs.floating]);

  return {
    context,
    placement: resolvedPlacement,
    middlewareData,
    floatingStyles: isMobileSheet
      ? {}
      : {
          ...floatingStyles,
          visibility:
            open && !isPositioned ? 'hidden' : floatingStyles.visibility,
        },
    isMobileSheet,
    setRef: refs.setReference,
    setFloatingRef: refs.setFloating,
    updatePosition: update,
  };
};
