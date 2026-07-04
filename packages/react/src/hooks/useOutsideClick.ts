import { useEffect, useRef } from 'react';

//Закрывать dropdown/modal при клике вне элемента
export const useOutsideClick = (
  refs: React.RefObject<HTMLElement | null>[],
  handler: () => void,
  enabled = true
) => {
  const refsRef = useRef(refs);
  refsRef.current = refs;

  const handleRef = useRef(handler);
  handleRef.current = handler;

  useEffect(() => {
    if (!enabled) return;

    const listener = (e: MouseEvent) => {
      const target = e.target as Node;
      const isOutside = refsRef.current.every(
        (ref) => ref.current && !ref.current.contains(target)
      );

      if (isOutside) {
        handleRef.current();
      }
    };
    // pointerdown for touch + mouse
    document.addEventListener('pointerdown', listener);

    return () => document.removeEventListener('pointerdown', listener);
  }, [enabled]);
};
