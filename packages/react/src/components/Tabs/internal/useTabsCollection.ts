import { useCallback, useRef, useState } from 'react';

import type { TabsValue } from '@vellira-ui/types';

import type { RegisteredContent, RegisteredTab } from './types';

const sortByDomOrder = (items: RegisteredTab[]) =>
  [...items].sort((a, b) => {
    if (a.element === b.element) return 0;

    const position = a.element.compareDocumentPosition(b.element);

    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;

    return 0;
  });

export const useTabsCollection = () => {
  const triggersRef = useRef<RegisteredTab[]>([]);
  const contentsRef = useRef<RegisteredContent[]>([]);
  const [version, setVersion] = useState(0);

  const bumpVersion = useCallback(() => {
    setVersion((current) => current + 1);
  }, []);

  const registerTrigger = useCallback(
    (value: TabsValue, element: HTMLButtonElement | null, disabled = false) => {
      if (!element) {
        const existingIndex = triggersRef.current.findIndex(
          (tab) => tab.value === value
        );

        if (existingIndex >= 0) {
          triggersRef.current.splice(existingIndex, 1);
          bumpVersion();
        }

        return;
      }

      const nextTab: RegisteredTab = {
        value,
        element,
        disabled,
      };

      const existingIndex = triggersRef.current.findIndex(
        (tab) => tab.element === element
      );

      if (existingIndex >= 0) {
        triggersRef.current[existingIndex] = nextTab;
      } else {
        triggersRef.current.push(nextTab);
      }

      triggersRef.current = sortByDomOrder(triggersRef.current);
      bumpVersion();
    },
    [bumpVersion]
  );

  const registerContent = useCallback(
    (value: TabsValue, mounted: boolean) => {
      const existingIndex = contentsRef.current.findIndex(
        (content) => content.value === value
      );

      if (!mounted) {
        if (existingIndex >= 0) {
          contentsRef.current.splice(existingIndex, 1);
          bumpVersion();
        }

        return;
      }

      if (existingIndex < 0) {
        contentsRef.current.push({ value });
        bumpVersion();
      }
    },
    [bumpVersion]
  );

  return {
    version,
    triggersRef,
    contentsRef,
    registerTrigger,
    registerContent,
  };
};
