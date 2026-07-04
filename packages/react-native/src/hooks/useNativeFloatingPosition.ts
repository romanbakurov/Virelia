import { useCallback, useRef, useState } from 'react';

import type { FloatingPlacement } from '@vellira-ui/types';
import type { RefObject } from 'react';
import type { LayoutChangeEvent, View } from 'react-native';
import { Dimensions } from 'react-native';

interface Position {
  top: number;
  left: number;
}

interface Size {
  width: number;
  height: number;
}

interface TriggerRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const safePadding = 12;

export function useNativeFloatingPosition(
  placement: FloatingPlacement = 'top',
  offset = 8
) {
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const floatingSizeRef = useRef<Size>({
    width: 0,
    height: 0,
  });
  const lastTriggerRef = useRef<RefObject<View | null> | null>(null);

  const clamp = useCallback((value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), Math.max(min, max));
  }, []);

  const calculatePosition = useCallback(
    (triggerRect: TriggerRect, size: Size): Position => {
      const { width: screenWidth, height: screenHeight } =
        Dimensions.get('window');
      const [side, align = 'center'] = placement.split('-');

      const horizontalTop =
        side === 'bottom'
          ? triggerRect.y + triggerRect.height + offset
          : triggerRect.y - size.height - offset;
      const verticalTop =
        align === 'start'
          ? triggerRect.y
          : align === 'end'
            ? triggerRect.y + triggerRect.height - size.height
            : triggerRect.y + triggerRect.height / 2 - size.height / 2;

      const horizontalLeft =
        align === 'start'
          ? triggerRect.x
          : align === 'end'
            ? triggerRect.x + triggerRect.width - size.width
            : triggerRect.x + triggerRect.width / 2 - size.width / 2;
      const verticalLeft =
        side === 'right'
          ? triggerRect.x + triggerRect.width + offset
          : triggerRect.x - size.width - offset;

      const rawPosition =
        side === 'left' || side === 'right'
          ? { top: verticalTop, left: verticalLeft }
          : { top: horizontalTop, left: horizontalLeft };

      return {
        top: clamp(
          rawPosition.top,
          safePadding,
          screenHeight - size.height - safePadding
        ),
        left: clamp(
          rawPosition.left,
          safePadding,
          screenWidth - size.width - safePadding
        ),
      };
    },
    [placement, offset, clamp]
  );

  const updatePosition = useCallback(
    (
      triggerRef: RefObject<View | null>,
      measuredSize = floatingSizeRef.current
    ) => {
      lastTriggerRef.current = triggerRef;
      const node = triggerRef.current;

      if (!node || typeof node.measureInWindow !== 'function') {
        setPosition({ top: 0, left: 0 });
        return;
      }

      node.measureInWindow((x, y, width, height) => {
        setPosition(calculatePosition({ x, y, width, height }, measuredSize));
      });
    },
    [calculatePosition]
  );

  const onFloatingLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      const nextSize = { width, height };

      floatingSizeRef.current = nextSize;

      if (lastTriggerRef.current) {
        updatePosition(lastTriggerRef.current, nextSize);
      }
    },
    [updatePosition]
  );

  return { position, updatePosition, onFloatingLayout };
}
