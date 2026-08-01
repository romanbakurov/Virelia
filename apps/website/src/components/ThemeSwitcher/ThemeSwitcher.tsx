'use client';

import { useEffect, useRef, type CSSProperties } from 'react';

import type { AnimatedIconData } from '@vellira-ui/icons/lottie';
import { animatedIcons } from '@vellira-ui/icons/lottie';
import { Button, Dropdown } from '@vellira-ui/react';
import lottie, {
  type AnimationItem,
} from 'lottie-web/build/player/lottie_light';

import { useWebsiteThemeContext } from '@/providers/WebsiteThemeContext';

import styles from './ThemeSwitcher.module.css';

const options = [
  { value: 'light', label: 'Light', icon: animatedIcons.Sun, iconSize: 25 },
  { value: 'dark', label: 'Dark', icon: animatedIcons.Moon },
  { value: 'system', label: 'System', icon: animatedIcons.System },
  {
    value: 'high-contrast',
    label: 'High Contrast',
    icon: animatedIcons.Contrast,
  },
] as const;

type AnimatedThemeIconProps = {
  data: AnimatedIconData;
  size?: number;
};

function cloneAnimationData(data: AnimatedIconData): object {
  return JSON.parse(JSON.stringify(data)) as object;
}

function getTriggerElement(container: HTMLSpanElement): HTMLElement {
  return (
    container.closest<HTMLElement>(
      'button, a, [role="button"], [role="menuitemradio"], [data-animated-icon-trigger]'
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
    if (stroke && stroke !== 'none') {
      node.setAttribute('stroke', 'currentColor');
    }
  });
}

function AnimatedThemeIcon({ data, size }: AnimatedThemeIconProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const animation: AnimationItem = lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: cloneAnimationData(data),
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
        progressiveLoad: false,
      },
    });

    const syncColor = () => applyCurrentColor(container);
    const playOnce = () => {
      animation.stop();
      animation.setDirection(1);
      animation.play();
    };
    const reset = () => {
      animation.stop();
      animation.goToAndStop(0, true);
      syncColor();
    };

    animation.addEventListener('DOMLoaded', syncColor);
    animation.addEventListener('enterFrame', syncColor);

    const trigger = getTriggerElement(container);
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
  }, [data]);

  return (
    <span
      ref={containerRef}
      className={styles.icon}
      style={
        size
          ? ({ '--theme-icon-size': `${size}px` } as CSSProperties)
          : undefined
      }
      aria-hidden='true'
    />
  );
}

export function ThemeSwitcher() {
  const { preference, setPreference } = useWebsiteThemeContext();

  const activeOption =
    options.find((option) => option.value === preference) ?? options[2];

  return (
    <Dropdown placement='bottom-end' offset={8} collisionPadding={16}>
      <Dropdown.Trigger asChild>
        <Button
          type='button'
          appearance='ghost'
          color='neutral'
          shape='square'
          size='sm'
          aria-label={`Theme: ${activeOption.label}`}
        >
          <AnimatedThemeIcon
            data={activeOption.icon}
            size={
              'iconSize' in activeOption ? activeOption.iconSize : undefined
            }
          />
        </Button>
      </Dropdown.Trigger>

      <Dropdown.Content className={styles.content}>
        <Dropdown.RadioGroup
          value={preference}
          onValueChange={(value) => {
            if (
              value === 'light' ||
              value === 'dark' ||
              value === 'system' ||
              value === 'high-contrast'
            ) {
              setPreference(value);
            }
          }}
        >
          {options.map((option) => (
            <Dropdown.RadioItem
              key={option.value}
              value={option.value}
              className={styles.item}
            >
              <Dropdown.ItemIcon>
                <AnimatedThemeIcon
                  data={option.icon}
                  size={'iconSize' in option ? option.iconSize : undefined}
                />
              </Dropdown.ItemIcon>

              {option.label}
            </Dropdown.RadioItem>
          ))}
        </Dropdown.RadioGroup>
      </Dropdown.Content>
    </Dropdown>
  );
}

ThemeSwitcher.displayName = 'ThemeSwitcher';
