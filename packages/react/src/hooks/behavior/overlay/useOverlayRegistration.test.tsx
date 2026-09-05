import { render } from '@test-utils/render';
import { afterEach, describe, expect, it } from 'vitest';

import { useOverlayRegistration } from './useOverlayRegistration';

import {
  createOverlayManager,
  overlayManager,
  OverlayManagerProvider,
} from '#managers';

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
  overlayManager.clear();
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
    expect(first?.zIndex).toBeGreaterThan(0);
    expect(second?.zIndex).toBeGreaterThan(first?.zIndex ?? 0);

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

  it('uses the nearest scoped overlay manager provider', () => {
    const scopedManager = createOverlayManager();
    let registration: ReturnType<typeof useOverlayRegistration> | undefined;

    const { unmount } = render(
      <OverlayManagerProvider manager={scopedManager}>
        <TestOverlay
          id='scoped'
          onReady={(nextRegistration) => {
            registration = nextRegistration;
          }}
        />
      </OverlayManagerProvider>
    );

    expect(registration?.isTopOverlay()).toBe(true);
    expect(scopedManager.getTopmost()?.id).toBe('scoped');
    expect(overlayManager.getTopmost()).toBeNull();

    unmount();
  });
});
