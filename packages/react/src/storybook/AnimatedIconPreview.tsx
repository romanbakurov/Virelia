import { useEffect, useRef } from 'react';

import type { AnimatedIconData } from '@vellira-ui/icons/lottie';
import lottie, {
  type AnimationItem,
} from 'lottie-web/build/player/lottie_light';

type AnimatedIconPreviewProps = {
  data: AnimatedIconData;
  size?: number;
  play?: 'hover' | 'loop';
};

function cloneAnimationData(data: AnimatedIconData): object {
  return JSON.parse(JSON.stringify(data)) as object;
}

function getTriggerElement(container: HTMLSpanElement): HTMLElement {
  return (
    container.closest<HTMLElement>(
      'button, a, [role="button"], [data-animated-icon-trigger]'
    ) ?? container
  );
}

function applyCurrentColor(container: HTMLElement) {
  const paintedNodes = container.querySelectorAll<SVGElement>(
    'path[fill], path[stroke], g[fill], g[stroke]'
  );

  paintedNodes.forEach((node) => {
    const fill = node.getAttribute('fill');
    const stroke = node.getAttribute('stroke');

    if (fill && fill !== 'none') node.setAttribute('fill', 'currentColor');
    if (stroke && stroke !== 'none')
      node.setAttribute('stroke', 'currentColor');
  });
}

export function AnimatedIconPreview({
  data,
  size = 16,
  play = 'hover',
}: AnimatedIconPreviewProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const animation: AnimationItem = lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: play === 'loop',
      autoplay: play === 'loop',
      animationData: cloneAnimationData(data),
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
        progressiveLoad: false,
      },
    });

    const syncColor = () => applyCurrentColor(container);
    animation.addEventListener('DOMLoaded', syncColor);
    animation.addEventListener('enterFrame', syncColor);

    const trigger = getTriggerElement(container);
    const playOnce = () => {
      if (play !== 'hover') return;
      animation.stop();
      animation.setDirection(1);
      animation.play();
    };
    const reset = () => {
      if (play !== 'hover') return;
      animation.stop();
      animation.goToAndStop(0, true);
      syncColor();
    };

    trigger.addEventListener('pointerenter', playOnce);
    trigger.addEventListener('focusin', playOnce);
    trigger.addEventListener('pointerleave', reset);
    trigger.addEventListener('focusout', reset);

    animation.goToAndStop(0, true);

    return () => {
      trigger.removeEventListener('pointerenter', playOnce);
      trigger.removeEventListener('focusin', playOnce);
      trigger.removeEventListener('pointerleave', reset);
      trigger.removeEventListener('focusout', reset);
      animation.removeEventListener('DOMLoaded', syncColor);
      animation.removeEventListener('enterFrame', syncColor);
      animation.destroy();
    };
  }, [data, play]);

  return (
    <span
      ref={containerRef}
      aria-hidden='true'
      style={{
        display: 'block',
        width: size,
        height: size,
        lineHeight: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
