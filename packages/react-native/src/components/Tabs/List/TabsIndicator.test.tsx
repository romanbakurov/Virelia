import { act } from 'react';

import type * as ReactNative from 'react-native';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../../test-utils/render';

const mocks = vi.hoisted(() => {
  const theme = {
    tokens: {
      radius: {
        sm: 4,
        md: 8,
        lg: 12,
        full: 999,
      },
    },

    components: {
      tabs: {
        primary: {
          indicator: {
            bg: '#6750a4',
          },

          pills: {
            active: {
              bg: '#eee8ff',
              border: '#6750a4',
            },
          },

          segmented: {
            active: {
              bg: '#ffffff',
              border: '#6750a4',
            },
          },
        },
      },
    },
  };

  const tabs = {
    value: 'overview' as string | undefined,
    orientation: 'horizontal' as 'horizontal' | 'vertical',
    variant: 'line' as 'line' | 'pills' | 'segmented',
    color: 'primary' as const,
    size: 'md' as 'sm' | 'md' | 'lg',
    indicatorVersion: 0,
    getTriggerLayout: vi.fn(),
  };

  const accessibility = {
    isReduceMotionEnabled: vi.fn(),
    addEventListener: vi.fn(),
  };

  return {
    theme,
    tabs,
    accessibility,
  };
});

const animatedMocks = vi.hoisted(() => ({
  timing: vi.fn(),
  parallel: vi.fn(),
  sequence: vi.fn(),
}));

vi.mock('react-native', async () => {
  const actual = await vi.importActual<typeof ReactNative>('react-native');

  return {
    ...actual,

    Easing: {
      ...actual.Easing,
      bezier: vi.fn(() => (value: number) => value),
    },

    AccessibilityInfo: {
      ...actual.AccessibilityInfo,
      isReduceMotionEnabled: mocks.accessibility.isReduceMotionEnabled,
      addEventListener: mocks.accessibility.addEventListener,
    },

    Platform: {
      OS: 'web',
      select: <T,>(specifics: { web?: T; default?: T }) =>
        specifics.web ?? specifics.default,
    },

    Animated: {
      ...actual.Animated,

      Value: class {
        private value = 0;

        constructor(v = 0) {
          this.value = v;
        }

        setValue = vi.fn((v: number) => {
          this.value = v;
        });

        __getValue() {
          return this.value;
        }

        interpolate() {
          return this;
        }
      },

      timing: animatedMocks.timing,
      sequence: animatedMocks.sequence,
      parallel: animatedMocks.parallel,
    },
  };
});

vi.mock('../../../theme', () => ({
  useTheme: () => ({
    theme: mocks.theme,
  }),
}));

vi.mock('../TabsContext', () => ({
  useTabs: () => mocks.tabs,
}));

import { TabsIndicator } from './TabsIndicator';

const createAnimation = () => ({
  start: vi.fn((callback?: () => void) => {
    callback?.();
  }),
  stop: vi.fn(),
});

const flushEffects = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

describe('Native TabsIndicator', () => {
  const timingSpy = animatedMocks.timing;
  const parallelSpy = animatedMocks.parallel;
  const sequenceSpy = animatedMocks.sequence;

  timingSpy.mockName('Animated.timing');
  parallelSpy.mockName('Animated.parallel');
  sequenceSpy.mockName('Animated.sequence');

  let removeSubscription: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mocks.tabs.value = 'overview';
    mocks.tabs.orientation = 'horizontal';
    mocks.tabs.variant = 'line';
    mocks.tabs.size = 'md';
    mocks.tabs.indicatorVersion = 0;

    timingSpy.mockReset();
    parallelSpy.mockReset();
    sequenceSpy.mockReset();

    timingSpy.mockImplementation(() => createAnimation() as never);
    parallelSpy.mockImplementation(() => createAnimation() as never);
    sequenceSpy.mockImplementation(() => createAnimation() as never);

    mocks.tabs.getTriggerLayout.mockReset();
    mocks.tabs.getTriggerLayout.mockReturnValue({
      x: 0,
      y: 0,
      width: 80,
      height: 36,
    });

    removeSubscription = vi.fn();

    mocks.accessibility.isReduceMotionEnabled.mockReset();
    mocks.accessibility.isReduceMotionEnabled.mockResolvedValue(false);

    mocks.accessibility.addEventListener.mockReset();
    mocks.accessibility.addEventListener.mockReturnValue({
      remove: removeSubscription,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('hides the indicator when no value is selected', async () => {
    mocks.tabs.value = undefined;

    const { container, unmount } = render(<TabsIndicator />);

    await flushEffects();

    const indicator = container.firstElementChild as HTMLElement;

    expect(indicator).not.toBeNull();
    expect(indicator.style.opacity).toBe('0');
    expect(mocks.tabs.getTriggerLayout).not.toHaveBeenCalled();

    unmount();
  });

  it('hides the indicator when the active trigger has no layout', async () => {
    mocks.tabs.getTriggerLayout.mockReturnValue(undefined);

    const { container, unmount } = render(<TabsIndicator />);

    await flushEffects();

    const indicator = container.firstElementChild as HTMLElement;

    expect(indicator.style.opacity).toBe('0');
    expect(sequenceSpy).not.toHaveBeenCalled();
    expect(parallelSpy).not.toHaveBeenCalled();

    unmount();
  });

  it('hides the indicator for an invalid zero-sized layout', async () => {
    mocks.tabs.getTriggerLayout.mockReturnValue({
      x: 0,
      y: 0,
      width: 0,
      height: 36,
    });

    const { container, unmount } = render(<TabsIndicator />);

    await flushEffects();

    const indicator = container.firstElementChild as HTMLElement;

    expect(indicator.style.opacity).toBe('0');
    expect(timingSpy).not.toHaveBeenCalled();

    unmount();
  });

  it('positions the initial horizontal line without animation', async () => {
    const { container, unmount } = render(
      <TabsIndicator>
        <span>indicator child</span>
      </TabsIndicator>
    );

    await flushEffects();

    const indicator = container.firstElementChild as HTMLElement;

    expect(indicator.style.opacity).toBe('1');
    expect(indicator.style.height).toBe('3px');
    expect(container.textContent).toContain('indicator child');
    expect(sequenceSpy).not.toHaveBeenCalled();
    expect(parallelSpy).not.toHaveBeenCalled();

    unmount();
  });

  it('animates a horizontal line through collapse, movement, and expansion', async () => {
    const first = render(<TabsIndicator />);

    await flushEffects();

    mocks.tabs.value = 'settings';
    mocks.tabs.indicatorVersion += 1;
    mocks.tabs.getTriggerLayout.mockReturnValue({
      x: 120,
      y: 0,
      width: 100,
      height: 36,
    });

    first.rerender(<TabsIndicator />);

    await flushEffects();

    expect(sequenceSpy).toHaveBeenCalledTimes(1);
    expect(parallelSpy).toHaveBeenCalledTimes(2);

    const timingTargets = timingSpy.mock.calls.map(
      ([, config]) => config.toValue
    );

    expect(timingTargets).toEqual(
      expect.arrayContaining([8, 36, 166, 100, 120])
    );

    expect(timingSpy.mock.calls.map(([, config]) => config.duration)).toEqual(
      expect.arrayContaining([360 * 0.28, 360 * 0.36])
    );

    first.unmount();
  });

  it('animates a vertical line through collapse, movement, and expansion', async () => {
    mocks.tabs.orientation = 'vertical';
    mocks.tabs.getTriggerLayout.mockReturnValue({
      x: 0,
      y: 10,
      width: 140,
      height: 44,
    });

    const first = render(<TabsIndicator />);

    await flushEffects();

    mocks.tabs.value = 'settings';
    mocks.tabs.indicatorVersion += 1;
    mocks.tabs.getTriggerLayout.mockReturnValue({
      x: 0,
      y: 90,
      width: 140,
      height: 52,
    });

    first.rerender(<TabsIndicator />);

    await flushEffects();

    expect(sequenceSpy).toHaveBeenCalledTimes(1);
    expect(parallelSpy).toHaveBeenCalledTimes(2);

    const timingTargets = timingSpy.mock.calls.map(
      ([, config]) => config.toValue
    );

    // Previous collapsed Y:
    // 10 + 44 / 2 - 8 / 2 = 28
    //
    // Next collapsed Y:
    // 90 + 52 / 2 - 8 / 2 = 112
    expect(timingTargets).toEqual(expect.arrayContaining([8, 28, 112, 52, 90]));

    first.unmount();
  });

  it('animates the pills floating surface in parallel', async () => {
    mocks.tabs.variant = 'pills';
    mocks.tabs.getTriggerLayout.mockReturnValue({
      x: 0,
      y: 0,
      width: 88,
      height: 36,
    });

    const first = render(<TabsIndicator />);

    await flushEffects();

    mocks.tabs.value = 'settings';
    mocks.tabs.indicatorVersion += 1;
    mocks.tabs.getTriggerLayout.mockReturnValue({
      x: 100,
      y: 2,
      width: 112,
      height: 40,
    });

    first.rerender(<TabsIndicator />);

    await flushEffects();

    expect(sequenceSpy).not.toHaveBeenCalled();
    expect(parallelSpy).toHaveBeenCalledTimes(1);
    expect(timingSpy).toHaveBeenCalledTimes(4);

    expect(timingSpy.mock.calls.map(([, config]) => config.toValue)).toEqual([
      100, 2, 112, 40,
    ]);

    expect(
      timingSpy.mock.calls.every(([, config]) => config.duration === 220)
    ).toBe(true);

    first.unmount();
  });

  it('animates the segmented floating surface in parallel', async () => {
    mocks.tabs.variant = 'segmented';
    mocks.tabs.getTriggerLayout.mockReturnValue({
      x: 0,
      y: 0,
      width: 90,
      height: 32,
    });

    const first = render(<TabsIndicator />);

    await flushEffects();

    mocks.tabs.value = 'profile';
    mocks.tabs.indicatorVersion += 1;
    mocks.tabs.getTriggerLayout.mockReturnValue({
      x: 94,
      y: 1,
      width: 108,
      height: 34,
    });

    first.rerender(<TabsIndicator />);

    await flushEffects();

    expect(sequenceSpy).not.toHaveBeenCalled();
    expect(parallelSpy).toHaveBeenCalledTimes(1);

    expect(timingSpy.mock.calls.map(([, config]) => config.toValue)).toEqual([
      94, 1, 108, 34,
    ]);

    first.unmount();
  });

  it.each([
    ['sm', 4],
    ['md', 8],
    ['lg', 12],
  ] as const)(
    'renders the pills indicator with the %s radius',
    async (size, expectedRadius) => {
      mocks.tabs.variant = 'pills';
      mocks.tabs.size = size;

      const { container, unmount } = render(<TabsIndicator />);

      await flushEffects();

      const indicator = container.firstElementChild as HTMLElement;

      expect(indicator.style.borderRadius).toBe(`${expectedRadius}px`);

      unmount();
    }
  );

  it('does not animate when reduced motion is enabled', async () => {
    mocks.accessibility.isReduceMotionEnabled.mockResolvedValue(true);

    const first = render(<TabsIndicator />);

    await flushEffects();

    timingSpy.mockClear();
    parallelSpy.mockClear();
    sequenceSpy.mockClear();

    mocks.tabs.value = 'settings';
    mocks.tabs.indicatorVersion += 1;
    mocks.tabs.getTriggerLayout.mockReturnValue({
      x: 120,
      y: 0,
      width: 100,
      height: 36,
    });

    first.rerender(<TabsIndicator />);

    await flushEffects();

    expect(timingSpy).not.toHaveBeenCalled();
    expect(parallelSpy).not.toHaveBeenCalled();
    expect(sequenceSpy).not.toHaveBeenCalled();

    first.unmount();
  });

  it('reacts to the reduced-motion accessibility event', async () => {
    let reduceMotionListener: ((enabled: boolean) => void) | undefined;

    mocks.accessibility.addEventListener.mockImplementation(
      (event: string, listener: (enabled: boolean) => void) => {
        if (event === 'reduceMotionChanged') {
          reduceMotionListener = listener;
        }

        return {
          remove: removeSubscription,
        };
      }
    );

    const first = render(<TabsIndicator />);

    await flushEffects();

    await act(async () => {
      reduceMotionListener?.(true);
    });

    timingSpy.mockClear();
    sequenceSpy.mockClear();
    parallelSpy.mockClear();

    mocks.tabs.value = 'settings';
    mocks.tabs.indicatorVersion += 1;
    mocks.tabs.getTriggerLayout.mockReturnValue({
      x: 120,
      y: 0,
      width: 100,
      height: 36,
    });

    first.rerender(<TabsIndicator />);

    await flushEffects();

    expect(timingSpy).not.toHaveBeenCalled();
    expect(sequenceSpy).not.toHaveBeenCalled();
    expect(parallelSpy).not.toHaveBeenCalled();

    first.unmount();
  });

  it('stops the active animation and removes the listener on unmount', async () => {
    const runningAnimation = createAnimation();

    sequenceSpy.mockReturnValue(runningAnimation as never);

    const first = render(<TabsIndicator />);

    await flushEffects();

    mocks.tabs.value = 'settings';
    mocks.tabs.indicatorVersion += 1;
    mocks.tabs.getTriggerLayout.mockReturnValue({
      x: 120,
      y: 0,
      width: 100,
      height: 36,
    });

    first.rerender(<TabsIndicator />);

    await flushEffects();

    first.unmount();

    expect(removeSubscription).toHaveBeenCalledTimes(1);
    expect(runningAnimation.stop).toHaveBeenCalledTimes(1);
  });

  it('does not animate when orientation changes between values', async () => {
    const first = render(<TabsIndicator />);

    await flushEffects();

    mocks.tabs.value = 'settings';
    mocks.tabs.orientation = 'vertical';
    mocks.tabs.indicatorVersion += 1;
    mocks.tabs.getTriggerLayout.mockReturnValue({
      x: 0,
      y: 80,
      width: 120,
      height: 44,
    });

    first.rerender(<TabsIndicator />);

    await flushEffects();

    expect(sequenceSpy).not.toHaveBeenCalled();
    expect(parallelSpy).not.toHaveBeenCalled();

    first.unmount();
  });
});
