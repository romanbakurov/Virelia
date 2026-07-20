import { useEffect, useRef } from 'react';

import type { FloatingPlacement } from '@vellira-ui/types';
import type { LayoutChangeEvent, View } from 'react-native';
import { afterEach, describe, expect, it } from 'vitest';

import { render } from '../../test-utils/render';

import { useNativeFloatingPosition } from './useNativeFloatingPosition';

const layoutEvent = (width: number, height: number) =>
  ({
    nativeEvent: {
      layout: { width, height },
    },
  }) as LayoutChangeEvent;

function TestPosition({
  placement,
  bubbleWidth = 80,
  bubbleHeight = 40,
}: {
  placement: FloatingPlacement;
  bubbleWidth?: number;
  bubbleHeight?: number;
}) {
  const triggerRef = useRef<View | null>({
    measureInWindow(callback) {
      callback(200, 200, 50, 20);
    },
  } as View);
  const { position, updatePosition, onFloatingLayout } =
    useNativeFloatingPosition(placement, 8);

  useEffect(() => {
    onFloatingLayout(layoutEvent(bubbleWidth, bubbleHeight));
    updatePosition(triggerRef);
  }, [bubbleHeight, bubbleWidth, onFloatingLayout, placement, updatePosition]);

  return (
    <span data-testid='position'>
      {position.top},{position.left}
    </span>
  );
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('useNativeFloatingPosition', () => {
  it('positions left placement before the trigger using the measured width', () => {
    const { container, unmount } = render(<TestPosition placement='left' />);

    expect(
      container.querySelector('[data-testid="position"]')?.textContent
    ).toBe('190,112');

    unmount();
  });

  it('positions right-end placement beside the trigger and aligns to the end', () => {
    const { container, unmount } = render(
      <TestPosition placement='right-end' />
    );

    expect(
      container.querySelector('[data-testid="position"]')?.textContent
    ).toBe('180,258');

    unmount();
  });

  it('uses measured bubble width for bottom alignment', () => {
    const { container, unmount } = render(
      <TestPosition placement='bottom' bubbleWidth={120} />
    );

    expect(
      container.querySelector('[data-testid="position"]')?.textContent
    ).toBe('228,165');

    unmount();
  });
});
