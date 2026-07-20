import { useEffect } from 'react';

import type { AriaIsolationOptions } from './types.js';

export const useAriaIsolation = ({
  active,
  enabled,
  content,
}: AriaIsolationOptions) => {
  useEffect(() => {
    if (!active || !enabled || !content) return;

    const hiddenElements: Array<{
      element: HTMLElement;
      ariaHidden: string | null;
    }> = [];
    const root = content.parentElement;

    Array.from(document.body.children).forEach((element) => {
      if (!(element instanceof HTMLElement)) return;
      if (element === root || element.contains(content)) return;

      hiddenElements.push({
        element,
        ariaHidden: element.getAttribute('aria-hidden'),
      });
      element.setAttribute('aria-hidden', 'true');
    });

    return () => {
      hiddenElements.forEach(({ element, ariaHidden }) => {
        if (ariaHidden === null) {
          element.removeAttribute('aria-hidden');
          return;
        }

        element.setAttribute('aria-hidden', ariaHidden);
      });
    };
  }, [active, content, enabled]);
};
