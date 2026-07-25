import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import type { CSSProperties } from 'react';

import { useTabsContext } from './TabsContext';

export type TabsIndicatorStyle = Pick<
  CSSProperties,
  'width' | 'height' | 'transform'
>;

interface TabsIndicatorGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

const COLLAPSED_SIZE = 8;
const LINE_ANIMATION_DURATION = 360;

export const useTabsIndicator = () => {
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const previousGeometryRef = useRef<TabsIndicatorGeometry | null>(null);
  const previousValueRef = useRef<string | undefined>(undefined);
  const animationRef = useRef<Animation | null>(null);
  const [style, setStyle] = useState<TabsIndicatorStyle>({});
  const { value, orientation, variant, collectionVersion, getTriggerId } =
    useTabsContext();

  useEffect(
    () => () => {
      animationRef.current?.cancel();
    },
    []
  );

  useLayoutEffect(() => {
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

    const applyStyle = (nextStyle: TabsIndicatorStyle) => {
      if (orientation === 'vertical') {
        indicator.style.width = '';
        indicator.style.height =
          typeof nextStyle.height === 'number'
            ? `${nextStyle.height}px`
            : String(nextStyle.height ?? '');
      } else {
        indicator.style.height = '';
        indicator.style.width =
          typeof nextStyle.width === 'number'
            ? `${nextStyle.width}px`
            : String(nextStyle.width ?? '');
      }

      indicator.style.transform = String(nextStyle.transform ?? '');
      setStyle(nextStyle);
    };

    const update = (animateLine = false) => {
      const listRect = list.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();
      const nextGeometry: TabsIndicatorGeometry = {
        x: triggerRect.left - listRect.left + list.scrollLeft,
        y: triggerRect.top - listRect.top + list.scrollTop,
        width: triggerRect.width,
        height: triggerRect.height,
      };

      if (orientation === 'vertical') {
        const nextStyle = {
          height: triggerRect.height,
          transform: `translate3d(0, ${nextGeometry.y}px, 0)`,
        } satisfies TabsIndicatorStyle;

        applyStyle(nextStyle);

        const previousGeometry = previousGeometryRef.current;
        const shouldAnimateLine =
          animateLine &&
          variant === 'line' &&
          previousGeometry &&
          previousValueRef.current !== value &&
          !(
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ) &&
          typeof indicator.animate === 'function';

        if (shouldAnimateLine) {
          animationRef.current?.cancel();

          const previousCenter =
            previousGeometry.y + previousGeometry.height / 2;
          const nextCenter = nextGeometry.y + nextGeometry.height / 2;
          const collapsedPreviousY = previousCenter - COLLAPSED_SIZE / 2;
          const collapsedNextY = nextCenter - COLLAPSED_SIZE / 2;

          animationRef.current = indicator.animate(
            [
              {
                height: `${previousGeometry.height}px`,
                transform: `translate3d(0, ${previousGeometry.y}px, 0)`,
                offset: 0,
              },
              {
                height: `${COLLAPSED_SIZE}px`,
                transform: `translate3d(0, ${collapsedPreviousY}px, 0)`,
                offset: 0.28,
              },
              {
                height: `${COLLAPSED_SIZE}px`,
                transform: `translate3d(0, ${collapsedNextY}px, 0)`,
                offset: 0.64,
              },
              {
                height: `${nextGeometry.height}px`,
                transform: `translate3d(0, ${nextGeometry.y}px, 0)`,
                offset: 1,
              },
            ],
            {
              duration: LINE_ANIMATION_DURATION,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              fill: 'none',
            }
          );
        }

        previousGeometryRef.current = nextGeometry;
        previousValueRef.current = value;
        return;
      }

      const nextStyle = {
        width: triggerRect.width,
        transform: `translate3d(${nextGeometry.x}px, 0, 0)`,
      } satisfies TabsIndicatorStyle;

      applyStyle(nextStyle);

      const previousGeometry = previousGeometryRef.current;
      const shouldAnimateLine =
        animateLine &&
        variant === 'line' &&
        previousGeometry &&
        previousValueRef.current !== value &&
        !(
          typeof window.matchMedia === 'function' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) &&
        typeof indicator.animate === 'function';

      if (shouldAnimateLine) {
        animationRef.current?.cancel();

        const previousCenter = previousGeometry.x + previousGeometry.width / 2;
        const nextCenter = nextGeometry.x + nextGeometry.width / 2;
        const collapsedPreviousX = previousCenter - COLLAPSED_SIZE / 2;
        const collapsedNextX = nextCenter - COLLAPSED_SIZE / 2;

        animationRef.current = indicator.animate(
          [
            {
              width: `${previousGeometry.width}px`,
              transform: `translate3d(${previousGeometry.x}px, 0, 0)`,
              offset: 0,
            },
            {
              width: `${COLLAPSED_SIZE}px`,
              transform: `translate3d(${collapsedPreviousX}px, 0, 0)`,
              offset: 0.28,
            },
            {
              width: `${COLLAPSED_SIZE}px`,
              transform: `translate3d(${collapsedNextX}px, 0, 0)`,
              offset: 0.64,
            },
            {
              width: `${nextGeometry.width}px`,
              transform: `translate3d(${nextGeometry.x}px, 0, 0)`,
              offset: 1,
            },
          ],
          {
            duration: LINE_ANIMATION_DURATION,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'none',
          }
        );
      }

      previousGeometryRef.current = nextGeometry;
      previousValueRef.current = value;
    };

    update(true);

    const observers: ResizeObserver[] = [];

    if (typeof ResizeObserver !== 'undefined') {
      const triggerObserver = new ResizeObserver(() => update(false));
      const listObserver = new ResizeObserver(() => update(false));

      triggerObserver.observe(trigger);
      listObserver.observe(list);
      observers.push(triggerObserver, listObserver);
    }

    const updateWithoutAnimation = () => update(false);

    list.addEventListener('scroll', updateWithoutAnimation, { passive: true });
    window.addEventListener('resize', updateWithoutAnimation);
    document.fonts?.ready.then(updateWithoutAnimation).catch(() => undefined);

    return () => {
      for (const observer of observers) {
        observer.disconnect();
      }

      list.removeEventListener('scroll', updateWithoutAnimation);
      window.removeEventListener('resize', updateWithoutAnimation);
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
