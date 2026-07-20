import type { RefObject } from 'react';

export const getRadioGroupItems = (rootRef: RefObject<HTMLElement | null>) => {
  const root = rootRef.current;

  if (!root) return [];

  return Array.from(
    root.querySelectorAll<HTMLInputElement>('input[type="radio"]')
  );
};

export const getEnabledRadioGroupItems = (
  rootRef: RefObject<HTMLElement | null>
) => getRadioGroupItems(rootRef).filter((item) => !item.disabled);
