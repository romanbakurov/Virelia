import { createRef } from 'react';

import type { View } from 'react-native';
import { Platform } from 'react-native';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../../test-utils/render';

import { useOverlayFocusRestore } from './useOverlayFocusRestore';

type TestOverlayProps = {
  enabled?: boolean;
  triggerRef: React.RefObject<View | null>;
  onReady: (controls: ReturnType<typeof useOverlayFocusRestore>) => void;
};

function TestOverlay({
  enabled = true,
  triggerRef,
  onReady,
}: TestOverlayProps) {
  const controls = useOverlayFocusRestore({
    enabled,
    triggerRef,
  });

  onReady(controls);

  return null;
}

afterEach(() => {
  vi.restoreAllMocks();
  nativeMocks.findNodeHandle.mockReset();
  nativeMocks.setAccessibilityFocus.mockReset();
});

const nativeMocks = vi.hoisted(() => ({
  findNodeHandle: vi.fn(),
  setAccessibilityFocus: vi.fn(),
}));

vi.mock('react-native', async () => {
  const actual = await vi.importActual('react-native');

  return {
    ...actual,
    findNodeHandle: nativeMocks.findNodeHandle,
    AccessibilityInfo: {
      ...actual.AccessibilityInfo,
      setAccessibilityFocus: nativeMocks.setAccessibilityFocus,
    },
  };
});

describe('useOverlayFocusRestore', () => {
  it('restores focus to the trigger on web', () => {
    const originalOS = Platform.OS;

    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'web',
    });

    const focus = vi.fn();
    const triggerRef = createRef<View>();

    triggerRef.current = {
      focus,
    } as unknown as View;

    let controls: ReturnType<typeof useOverlayFocusRestore> | undefined;

    const { unmount } = render(
      <TestOverlay
        triggerRef={triggerRef}
        onReady={(value) => {
          controls = value;
        }}
      />
    );

    controls?.restoreFocus();

    expect(focus).toHaveBeenCalledTimes(1);

    unmount();

    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: originalOS,
    });
  });

  it('does not restore focus when disabled', () => {
    const originalOS = Platform.OS;

    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'web',
    });

    const focus = vi.fn();
    const triggerRef = createRef<View>();

    triggerRef.current = {
      focus,
    } as unknown as View;

    let controls: ReturnType<typeof useOverlayFocusRestore> | undefined;

    const { unmount } = render(
      <TestOverlay
        enabled={false}
        triggerRef={triggerRef}
        onReady={(value) => {
          controls = value;
        }}
      />
    );

    controls?.restoreFocus();
    controls?.restoreFocusAfterClose();

    expect(focus).not.toHaveBeenCalled();

    unmount();

    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: originalOS,
    });
  });

  it('restores focus after close on the next animation frame', () => {
    const originalOS = Platform.OS;

    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'web',
    });

    const focus = vi.fn();
    const animationFrame = vi
      .spyOn(globalThis, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        callback(0);
        return 1;
      });

    const triggerRef = createRef<View>();

    triggerRef.current = {
      focus,
    } as unknown as View;

    let controls: ReturnType<typeof useOverlayFocusRestore> | undefined;

    const { unmount } = render(
      <TestOverlay
        triggerRef={triggerRef}
        onReady={(value) => {
          controls = value;
        }}
      />
    );

    controls?.restoreFocusAfterClose();

    expect(animationFrame).toHaveBeenCalledTimes(1);
    expect(focus).toHaveBeenCalledTimes(1);

    unmount();

    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: originalOS,
    });
  });

  it('does nothing when the trigger ref is empty on web', () => {
    const originalOS = Platform.OS;

    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'web',
    });

    const triggerRef = createRef<View>();

    let controls: ReturnType<typeof useOverlayFocusRestore> | undefined;

    const { unmount } = render(
      <TestOverlay
        triggerRef={triggerRef}
        onReady={(value) => {
          controls = value;
        }}
      />
    );

    expect(() => controls?.restoreFocus()).not.toThrow();

    unmount();

    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: originalOS,
    });
  });

  it('restores accessibility focus on native', () => {
    const originalOS = Platform.OS;

    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'android',
    });

    const triggerRef = createRef<View>();
    triggerRef.current = {} as View;

    const nodeHandle = 42;

    nativeMocks.findNodeHandle.mockReturnValue(nodeHandle);
    nativeMocks.setAccessibilityFocus.mockImplementation(() => {});

    let controls: ReturnType<typeof useOverlayFocusRestore> | undefined;

    const { unmount } = render(
      <TestOverlay
        triggerRef={triggerRef}
        onReady={(value) => {
          controls = value;
        }}
      />
    );

    controls?.restoreFocus();

    expect(nativeMocks.findNodeHandle).toHaveBeenCalledWith(triggerRef.current);

    expect(nativeMocks.setAccessibilityFocus).toHaveBeenCalledWith(nodeHandle);

    unmount();

    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: originalOS,
    });
  });
});
