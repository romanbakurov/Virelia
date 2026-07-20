import { useCallback } from 'react';

import type { KeyboardEvent, RefObject } from 'react';

import { getEnabledRadioGroupItems } from './useRadioGroupCollection';

type UseRadioGroupKeyboardOptions = {
  rootRef: RefObject<HTMLElement | null>;
  orientation: 'horizontal' | 'vertical';
};

const horizontalKeys = ['ArrowLeft', 'ArrowRight'] as const;
const verticalKeys = ['ArrowUp', 'ArrowDown'] as const;

export function useRadioGroupKeyboard({
  rootRef,
  orientation,
}: UseRadioGroupKeyboardOptions) {
  return useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const isHorizontalKey = horizontalKeys.includes(
        event.key as (typeof horizontalKeys)[number]
      );
      const isVerticalKey = verticalKeys.includes(
        event.key as (typeof verticalKeys)[number]
      );
      const isHomeOrEnd = event.key === 'Home' || event.key === 'End';

      if (!isHorizontalKey && !isVerticalKey && !isHomeOrEnd) return;
      if (orientation === 'horizontal' && isVerticalKey) return;
      if (orientation === 'vertical' && isHorizontalKey) return;

      const items = getEnabledRadioGroupItems(rootRef);

      if (items.length === 0) return;

      event.preventDefault();

      const activeElement = document.activeElement;
      const activeIndex = items.findIndex((item) => item === activeElement);
      const checkedIndex = items.findIndex((item) => item.checked);
      const currentIndex =
        activeIndex >= 0 ? activeIndex : Math.max(checkedIndex, 0);

      let nextIndex = currentIndex;

      if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = items.length - 1;
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % items.length;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + items.length) % items.length;
      }

      const nextItem = items[nextIndex];

      nextItem?.focus();
      nextItem?.click();
    },
    [orientation, rootRef]
  );
}
