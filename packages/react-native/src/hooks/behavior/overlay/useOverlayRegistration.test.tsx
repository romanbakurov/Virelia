import { afterEach, describe, expect, it } from 'vitest';

import {
  createNativeOverlayManager,
  nativeOverlayManager,
  NativeOverlayManagerProvider,
} from '../../../managers/OverlayManager';
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
    expect(first?.zIndex).toBeGreaterThanOrEqual(1000);
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
    const scopedManager = createNativeOverlayManager();
    let registration: ReturnType<typeof useOverlayRegistration> | undefined;

    const { unmount } = render(
      <NativeOverlayManagerProvider manager={scopedManager}>
        <TestOverlay
          id='scoped'
          onReady={(nextRegistration) => {
            registration = nextRegistration;
          }}
        />
      </NativeOverlayManagerProvider>
    );

    expect(registration?.isTopOverlay()).toBe(true);
    expect(scopedManager.getTop()?.id).toBe('scoped');
    expect(nativeOverlayManager.getTop()).toBeUndefined();

    unmount();
  });
});
