import { useEffect, useMemo, useRef, useState } from 'react';

import type { CSSProperties } from 'react';

import { useTabsContext } from './TabsContext';

export type TabsIndicatorStyle = Pick<
  CSSProperties,
  'width' | 'height' | 'transform'
>;

export const useTabsIndicator = () => {
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const [style, setStyle] = useState<TabsIndicatorStyle>({});
  const { value, orientation, dir, collectionVersion, getTriggerId } =
    useTabsContext();

  useEffect(() => {
    const indicator = indicatorRef.current;

    if (!indicator || !value) {
      setStyle({});
      return;
    }

    const list = indicator.parentElement;
    const trigger = document.getElementById(getTriggerId(value));

    if (!list || !trigger) {
      setStyle({
        width: 0,
        height: 0,
        transform: 'translateX(0)',
      });
      return;
    }

    const update = () => {
      const listRect = list.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();

      if (orientation === 'vertical') {
        setStyle({
          height: triggerRect.height,
          transform: `translateY(${triggerRect.top - listRect.top + list.scrollTop}px)`,
        });
        return;
      }

      const offset =
        dir === 'rtl'
          ? listRect.right - triggerRect.right + list.scrollLeft
          : triggerRect.left - listRect.left + list.scrollLeft;

      setStyle({
        width: triggerRect.width,
        transform: `translateX(${offset}px)`,
      });
    };

    update();

    const observers: ResizeObserver[] = [];

    if (typeof ResizeObserver !== 'undefined') {
      const triggerObserver = new ResizeObserver(update);
      const listObserver = new ResizeObserver(update);

      triggerObserver.observe(trigger);
      listObserver.observe(list);
      observers.push(triggerObserver, listObserver);
    }

    list.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    document.fonts?.ready.then(update).catch(() => undefined);

    return () => {
      for (const observer of observers) {
        observer.disconnect();
      }

      list.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [collectionVersion, dir, getTriggerId, orientation, value]);

  return useMemo(
    () => ({
      ref: indicatorRef,
      style,
    }),
    [style]
  );
};
