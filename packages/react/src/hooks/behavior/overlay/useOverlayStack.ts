import { useCallback, useEffect } from 'react';

let stack: string[] = [];

const overlayStackStore = {
  add(id: string) {
    stack = stack.filter((item) => item !== id);
    stack.push(id);
  },
  remove(id: string) {
    stack = stack.filter((item) => item !== id);
  },
  isTop(id: string) {
    return stack[stack.length - 1] === id;
  },
};

export type OverlayStackOptions = {
  active: boolean;
  id: string;
};

export const useOverlayStack = ({ active, id }: OverlayStackOptions) => {
  useEffect(() => {
    if (!active) return;

    overlayStackStore.add(id);

    return () => {
      overlayStackStore.remove(id);
    };
  }, [active, id]);

  const isTopOverlay = useCallback(() => overlayStackStore.isTop(id), [id]);

  return { isTopOverlay };
};
