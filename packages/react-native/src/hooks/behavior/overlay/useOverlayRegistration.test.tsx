import { afterEach, describe, expect, it } from 'vitest';

import { nativeOverlayManager } from '../../../managers/OverlayManager';
import { render } from '../../../test-utils/render';

import { useOverlayRegistration } from './useOverlayRegistration';

function TestOverlay({
  active = true,
  id,
  onReady,
}: {
  active?: boolean;
  id: string;
  onReady: (registration: ReturnType<typeof useOverlayRegistration>) => void;
}) {
  const registration = useOverlayRegistration({
    active,
    id,
  });

  onReady(registration);

  return null;
}

afterEach(() => {
  nativeOverlayManager.clear();
});

describe('useOverlayRegistration', () => {
  it('registers active overlays and reports the topmost overlay', () => {
    let first: ReturnType<typeof useOverlayRegistration> | undefined;
    let second: ReturnType<typeof useOverlayRegistration> | undefined;

    const { unmount } = render(
      <>
        <TestOverlay
          id='first'
          onReady={(registration) => {
            first = registration;
          }}
        />
        <TestOverlay
          id='second'
          onReady={(registration) => {
            second = registration;
          }}
        />
      </>
    );

    expect(first?.isTopOverlay()).toBe(false);
    expect(second?.isTopOverlay()).toBe(true);
    expect(first?.layer).toBeGreaterThanOrEqual(1000);
    expect(second?.layer).toBeGreaterThan(first?.layer ?? 0);
    expect(first?.zIndex).toBe(first?.layer);
    expect(second?.zIndex).toBe(second?.layer);

    unmount();
  });

  it('unregisters overlays when they become inactive', () => {
    let first: ReturnType<typeof useOverlayRegistration> | undefined;
    let second: ReturnType<typeof useOverlayRegistration> | undefined;

    const { rerender, unmount } = render(
      <>
        <TestOverlay
          id='first'
          onReady={(registration) => {
            first = registration;
          }}
        />
        <TestOverlay
          id='second'
          onReady={(registration) => {
            second = registration;
          }}
        />
      </>
    );

    expect(second?.isTopOverlay()).toBe(true);

    rerender(
      <>
        <TestOverlay
          id='first'
          onReady={(registration) => {
            first = registration;
          }}
        />
        <TestOverlay
          active={false}
          id='second'
          onReady={(registration) => {
            second = registration;
          }}
        />
      </>
    );

    expect(first?.isTopOverlay()).toBe(true);
    expect(second?.isTopOverlay()).toBe(false);

    unmount();
  });
});
