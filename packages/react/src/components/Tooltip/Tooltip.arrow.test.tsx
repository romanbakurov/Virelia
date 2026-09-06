import { render } from '@test-utils/render';
import { afterEach, describe, expect, it } from 'vitest';

import { Tooltip } from './Tooltip';

import { Portal } from '#primitives/Portal';

const cases = [
  ['top-start', 'top', 'bottom'],
  ['right-end', 'right', 'left'],
  ['bottom-start', 'bottom', 'top'],
  ['left-end', 'left', 'right'],
] as const;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Tooltip arrow side contract', () => {
  it.each(cases)(
    'normalizes %s placement to %s and anchors the %s side',
    (placement, side, staticSide) => {
      const { unmount } = render(
        <Tooltip open placement={placement} avoidCollisions={false}>
          <Tooltip.Trigger>Trigger</Tooltip.Trigger>
          <Portal>
            <Tooltip.Content withArrow>Tooltip content</Tooltip.Content>
          </Portal>
        </Tooltip>
      );

      const tooltip = document.querySelector('[role="tooltip"]');
      const arrow = tooltip?.querySelector<HTMLDivElement>('[data-side]');

      expect(tooltip?.getAttribute('data-placement')).toBe(placement);
      expect(arrow?.dataset.side).toBe(side);
      expect(arrow?.style.getPropertyValue(staticSide)).toBe(
        'calc(var(--tooltip-arrow-size) / -2)'
      );

      unmount();
    }
  );
});
