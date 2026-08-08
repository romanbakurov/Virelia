import { Platform } from 'react-native';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../../test-utils/render';

import { useOverlayDismiss } from './useOverlayDismiss';

type TestOverlayProps = {
  active?: boolean;
  closeOnEscape?: boolean;
  id: string;
  onClose: () => void;
};

const backHandlerListeners = new Set<() => boolean>();

vi.mock('react-native', async () => {
  const actual = await vi.importActual('react-native');

  return {
    ...actual,
    BackHandler: {
      addEventListener: vi.fn((_eventName: string, listener: () => boolean) => {
        backHandlerListeners.add(listener);

        return {
          remove: () => {
            backHandlerListeners.delete(listener);
          },
        };
      }),
    },
  };
});

function TestOverlay({
  active = true,
  closeOnEscape = true,
  id,
  onClose,
}: TestOverlayProps) {
  useOverlayDismiss({
    active,
    closeOnEscape,
    id,
    requestClose: onClose,
  });

  return null;
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  backHandlerListeners.clear();
});

describe('useOverlayDismiss', () => {
  it('closes the topmost overlay on Escape', () => {
    const closeFirst = vi.fn();
    const closeSecond = vi.fn();

    const { unmount } = render(
      <>
        <TestOverlay id='first' onClose={closeFirst} />
        <TestOverlay id='second' onClose={closeSecond} />
      </>
    );

    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      })
    );

    expect(closeSecond).toHaveBeenCalledTimes(1);
    expect(closeFirst).not.toHaveBeenCalled();

    unmount();
  });

  it('does not close a non-topmost overlay on Escape', () => {
    const closeFirst = vi.fn();
    const closeSecond = vi.fn();

    const { unmount } = render(
      <>
        <TestOverlay id='first' onClose={closeFirst} />
        <TestOverlay id='second' onClose={closeSecond} />
      </>
    );

    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      })
    );

    expect(closeFirst).not.toHaveBeenCalled();
    expect(closeSecond).toHaveBeenCalledTimes(1);

    unmount();
  });

  it('ignores Escape when closeOnEscape is disabled', () => {
    const onClose = vi.fn();

    const { unmount } = render(
      <TestOverlay id='overlay' closeOnEscape={false} onClose={onClose} />
    );

    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      })
    );

    expect(onClose).not.toHaveBeenCalled();

    unmount();
  });

  it('removes the Escape listener after unmount', () => {
    const onClose = vi.fn();

    const { unmount } = render(<TestOverlay id='overlay' onClose={onClose} />);

    unmount();

    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      })
    );

    expect(onClose).not.toHaveBeenCalled();
  });

  it('handles Android back press for the topmost overlay', () => {
    const originalOS = Platform.OS;

    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'android',
    });

    const onClose = vi.fn();

    const { unmount } = render(<TestOverlay id='overlay' onClose={onClose} />);

    const handler = Array.from(backHandlerListeners).at(-1);

    expect(handler).toBeDefined();
    expect(handler?.()).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);

    unmount();

    expect(backHandlerListeners.size).toBe(0);

    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: originalOS,
    });
  });

  it('uses a dedicated outside close callback when provided', () => {
    const requestClose = vi.fn();
    const requestOutsideClose = vi.fn();

    let controls: ReturnType<typeof useOverlayDismiss> | undefined;

    function TestOverlay() {
      controls = useOverlayDismiss({
        active: true,
        id: 'overlay',
        requestClose,
        requestOutsideClose,
      });

      return null;
    }

    const { unmount } = render(<TestOverlay />);

    controls?.requestOutsideClose();

    expect(requestOutsideClose).toHaveBeenCalledTimes(1);
    expect(requestClose).not.toHaveBeenCalled();

    unmount();
  });

  it('falls back to requestClose for outside dismissal', () => {
    const requestClose = vi.fn();

    let controls: ReturnType<typeof useOverlayDismiss> | undefined;

    function TestOverlay() {
      controls = useOverlayDismiss({
        active: true,
        id: 'overlay',
        requestClose,
      });

      return null;
    }

    const { unmount } = render(<TestOverlay />);

    controls?.requestOutsideClose();

    expect(requestClose).toHaveBeenCalledTimes(1);

    unmount();
  });

  it('dispatches outside dismissal only to the topmost overlay', () => {
    const closeFirst = vi.fn();
    const closeSecond = vi.fn();

    let firstControls: ReturnType<typeof useOverlayDismiss> | undefined;

    function TestOverlay({
      id,
      onClose,
      onReady,
    }: {
      id: string;
      onClose: () => void;
      onReady?: (controls: ReturnType<typeof useOverlayDismiss>) => void;
    }) {
      const controls = useOverlayDismiss({
        active: true,
        id,
        requestClose: onClose,
      });

      onReady?.(controls);

      return null;
    }

    const { unmount } = render(
      <>
        <TestOverlay
          id='first'
          onClose={closeFirst}
          onReady={(controls) => {
            firstControls = controls;
          }}
        />
        <TestOverlay id='second' onClose={closeSecond} />
      </>
    );

    firstControls?.requestOutsideClose();

    expect(closeFirst).not.toHaveBeenCalled();
    expect(closeSecond).toHaveBeenCalledTimes(1);

    unmount();
  });

  it('exposes the registered overlay z-index', () => {
    let zIndex: number | undefined;

    function TestOverlay() {
      const dismiss = useOverlayDismiss({
        active: true,
        id: 'layered-overlay',
        requestClose: vi.fn(),
      });

      zIndex = dismiss.zIndex;

      return null;
    }

    const { unmount } = render(<TestOverlay />);

    expect(zIndex).toBeGreaterThanOrEqual(1000);

    unmount();
  });
});
