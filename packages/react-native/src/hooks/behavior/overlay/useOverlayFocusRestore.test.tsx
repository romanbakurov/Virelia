import { createRef } from 'react';

import type { View } from 'react-native';
import { Platform } from 'react-native';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../../test-utils/render';

import { useOverlayFocusRestore } from './useOverlayFocusRestore';

type TestOverlayProps = {
  active?: boolean;
  enabled?: boolean;
  finalFocus?: React.RefObject<View | null>;
  triggerRef: React.RefObject<View | null>;
  onReady: (controls: ReturnType<typeof useOverlayFocusRestore>) => void;
};

function TestOverlay({
  active,
  enabled = true,
  finalFocus,
  triggerRef,
  onReady,
}: TestOverlayProps) {
  const controls = useOverlayFocusRestore({
    active,
    enabled,
    finalFocus,
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

  it('restores focus to the saved focused element on web when trigger is empty', () => {
    const originalOS = Platform.OS;

    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'web',
    });

    const triggerRef = createRef<View>();
    const trigger = document.createElement('button');
    const contentButton = document.createElement('button');

    trigger.type = 'button';
    contentButton.type = 'button';
    document.body.append(trigger, contentButton);
    trigger.focus();

    let controls: ReturnType<typeof useOverlayFocusRestore> | undefined;

    const { unmount } = render(
      <TestOverlay
        active
        triggerRef={triggerRef}
        onReady={(value) => {
          controls = value;
        }}
      />
    );

    contentButton.focus();
    controls?.restoreFocus();

    expect(document.activeElement).toBe(trigger);

    unmount();
    trigger.remove();
    contentButton.remove();

    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: originalOS,
    });
  });

  it('prefers finalFocus over trigger focus on web', () => {
    const originalOS = Platform.OS;

    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'web',
    });

    const triggerFocus = vi.fn();
    const finalFocusHandler = vi.fn();
    const triggerRef = createRef<View>();
    const finalFocus = createRef<View>();

    triggerRef.current = {
      focus: triggerFocus,
    } as unknown as View;
    finalFocus.current = {
      focus: finalFocusHandler,
    } as unknown as View;

    let controls: ReturnType<typeof useOverlayFocusRestore> | undefined;

    const { unmount } = render(
      <TestOverlay
        finalFocus={finalFocus}
        triggerRef={triggerRef}
        onReady={(value) => {
          controls = value;
        }}
      />
    );

    controls?.restoreFocus();

    expect(finalFocusHandler).toHaveBeenCalledTimes(1);
    expect(triggerFocus).not.toHaveBeenCalled();

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
