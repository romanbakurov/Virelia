import { useEffect } from 'react';

import type { AriaHiddenOptions } from './types.js';

export const useAriaHidden = ({
  active,
  enabled,
  content,
}: AriaHiddenOptions) => {
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
