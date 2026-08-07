import { afterEach, describe, expect, it } from 'vitest';

import { nativeOverlayManager } from './NativeOverlayManager';

afterEach(() => {
  nativeOverlayManager.unregister('first');
  nativeOverlayManager.unregister('second');
  nativeOverlayManager.unregister('third');
});

describe('nativeOverlayManager', () => {
  it('registers overlays in stack order', () => {
    nativeOverlayManager.register('first');
    nativeOverlayManager.register('second');

    expect(nativeOverlayManager.getTop()?.id).toBe('second');
    expect(nativeOverlayManager.isTop('second')).toBe(true);
    expect(nativeOverlayManager.isTop('first')).toBe(false);
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
  });
});
