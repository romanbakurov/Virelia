import { useEffect, useMemo, useRef, useState } from 'react';

import type { CSSProperties } from 'react';

import { useTabsContext } from './TabsContext';

export type TabsIndicatorStyle = Pick<
  CSSProperties,
  'width' | 'height' | 'transform'
>;

export const useTabsIndicator = () => {
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const previousValueRef = useRef<string | undefined>(undefined);
  const [style, setStyle] = useState<TabsIndicatorStyle>({});
  const { value, orientation, variant, collectionVersion, getTriggerId } =
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

    let animationFrame = 0;

    const update = () => {
      const listRect = list.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();
      const revealLine =
        variant === 'line' && previousValueRef.current !== value;

      if (orientation === 'vertical') {
        const translate = `translateY(${triggerRect.top - listRect.top + list.scrollTop}px)`;
        const nextStyle = {
          height: triggerRect.height,
          transform: variant === 'line' ? `${translate} scaleY(1)` : translate,
        } satisfies TabsIndicatorStyle;

        if (revealLine) {
          setStyle({
            ...nextStyle,
            transform: `${translate} scaleY(0.08)`,
          });
          animationFrame = window.requestAnimationFrame(() => {
            setStyle(nextStyle);
          });
          previousValueRef.current = value;
          return;
        }

        setStyle(nextStyle);
        previousValueRef.current = value;
        return;
      }

      const offset = triggerRect.left - listRect.left + list.scrollLeft;
      const translate = `translateX(${offset}px)`;
      const nextStyle = {
        width: triggerRect.width,
        transform: variant === 'line' ? `${translate} scaleX(1)` : translate,
      } satisfies TabsIndicatorStyle;

      if (revealLine) {
        setStyle({
          ...nextStyle,
          transform: `${translate} scaleX(0.08)`,
        });
        animationFrame = window.requestAnimationFrame(() => {
          setStyle(nextStyle);
        });
        previousValueRef.current = value;
        return;
      }

      setStyle(nextStyle);
      previousValueRef.current = value;
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

      window.cancelAnimationFrame(animationFrame);
      list.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [collectionVersion, getTriggerId, orientation, value, variant]);

  return useMemo(
    () => ({
      ref: indicatorRef,
      style,
    }),
    [style]
  );
};
