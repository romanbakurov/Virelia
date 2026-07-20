import type { Ref } from 'react';

export function composeEventHandlers<
  TEvent extends { defaultPrevented?: boolean },
>(
  userHandler: ((event: TEvent) => void) | undefined,
  ownHandler: ((event: TEvent) => void) | undefined
) {
  return (event: TEvent) => {
    userHandler?.(event);

    if (!event.defaultPrevented) {
      ownHandler?.(event);
    }
  };
}

export function composeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(node);
        return;
      }

      (ref as { current: T | null }).current = node;
    });
  };
}
