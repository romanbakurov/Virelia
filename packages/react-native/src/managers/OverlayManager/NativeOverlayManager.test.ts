import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createNativeOverlayManager,
  nativeOverlayManager,
} from './NativeOverlayManager';

afterEach(() => {
  nativeOverlayManager.clear();
});

describe('nativeOverlayManager', () => {
  it('registers overlays in stack order', () => {
    nativeOverlayManager.register('first');
    nativeOverlayManager.register('second');

    expect(nativeOverlayManager.getTop()?.id).toBe('second');
    expect(nativeOverlayManager.isTop('second')).toBe(true);
    expect(nativeOverlayManager.isTop('first')).toBe(false);
  });

  it('creates isolated manager instances', () => {
    const firstManager = createNativeOverlayManager();
    const secondManager = createNativeOverlayManager();

    firstManager.register('first');
    secondManager.register('second');

    expect(firstManager.getTop()?.id).toBe('first');
    expect(secondManager.getTop()?.id).toBe('second');
  });

  it('moves an existing overlay to the top when re-registered', () => {
    nativeOverlayManager.register('first');
    nativeOverlayManager.register('second');
    nativeOverlayManager.register('first');

    expect(nativeOverlayManager.getTop()?.id).toBe('first');
  });

  it('removes overlays from the stack', () => {
    nativeOverlayManager.register('first');
    nativeOverlayManager.register('second');

    nativeOverlayManager.unregister('second');

    expect(nativeOverlayManager.getTop()?.id).toBe('first');
  });

  it('assigns increasing layers', () => {
    const first = nativeOverlayManager.register('first');
    const second = nativeOverlayManager.register('second');

    expect(second.layer).toBeGreaterThan(first.layer);
  });

  it('returns the registered layer', () => {
    const entry = nativeOverlayManager.register('first');

    expect(nativeOverlayManager.getLayer('first')).toBe(entry.layer);
    expect(entry.zIndex).toBe(entry.layer);
  });

  it('dispatches dismissal only to the topmost overlay handler', () => {
    const first = vi.fn(() => true);
    const second = vi.fn(() => true);

    nativeOverlayManager.register('first');
    nativeOverlayManager.registerDismissHandler('first', first);
    nativeOverlayManager.register('second');
    nativeOverlayManager.registerDismissHandler('second', second);

    expect(nativeOverlayManager.dispatchTopDismiss()).toBe(true);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('does not dispatch dismissal to lower overlays when the topmost returns false', () => {
    const first = vi.fn(() => true);
    const second = vi.fn(() => false);

    nativeOverlayManager.register('first');
    nativeOverlayManager.registerDismissHandler('first', first);
    nativeOverlayManager.register('second');
    nativeOverlayManager.registerDismissHandler('second', second);

    expect(nativeOverlayManager.dispatchTopDismiss()).toBe(false);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('dispatches outside press only to the topmost overlay handler', () => {
    const first = vi.fn(() => true);
    const second = vi.fn(() => true);

    nativeOverlayManager.register('first');
    nativeOverlayManager.registerOutsidePressHandler('first', first);
    nativeOverlayManager.register('second');
    nativeOverlayManager.registerOutsidePressHandler('second', second);

    expect(nativeOverlayManager.dispatchTopOutsidePress()).toBe(true);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('does not dispatch outside press to lower overlays when the topmost returns false', () => {
    const first = vi.fn(() => true);
    const second = vi.fn(() => false);

    nativeOverlayManager.register('first');
    nativeOverlayManager.registerOutsidePressHandler('first', first);
    nativeOverlayManager.register('second');
    nativeOverlayManager.registerOutsidePressHandler('second', second);

    expect(nativeOverlayManager.dispatchTopOutsidePress()).toBe(false);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
