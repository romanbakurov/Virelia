import { describe, expect, it } from 'vitest';

import { createOverlayManager } from './OverlayManager';

describe('OverlayManager', () => {
  it('registers overlays in stable stack order and exposes the topmost entry', () => {
    const manager = createOverlayManager();

    manager.register({ id: 'popover', layer: 'popover' });
    manager.register({ id: 'dropdown', layer: 'dropdown' });

    expect(manager.getStack().map((entry) => entry.id)).toEqual([
      'popover',
      'dropdown',
    ]);
    expect(manager.getTopmost()?.id).toBe('dropdown');
    expect(manager.isTopmost('popover')).toBe(false);
    expect(manager.isTopmost('dropdown')).toBe(true);
  });

  it('moves an existing overlay to the top when it registers again', () => {
    const manager = createOverlayManager();

    manager.register({ id: 'first' });
    manager.register({ id: 'second' });
    manager.register({ id: 'first' });

    expect(manager.getStack().map((entry) => entry.id)).toEqual([
      'second',
      'first',
    ]);
    expect(manager.getTopmost()?.id).toBe('first');
  });

  it('removes overlays without disturbing the remaining order', () => {
    const manager = createOverlayManager();

    manager.register({ id: 'first' });
    manager.register({ id: 'second' });
    manager.register({ id: 'third' });
    manager.unregister('second');

    expect(manager.getStack().map((entry) => entry.id)).toEqual([
      'first',
      'third',
    ]);
    expect(manager.getTopmost()?.id).toBe('third');
  });

  it('calculates z-index from layer base and stack order unless explicitly set', () => {
    const manager = createOverlayManager();

    manager.register({ id: 'dropdown', layer: 'dropdown' });
    manager.register({ id: 'popover', layer: 'popover' });
    manager.register({ id: 'custom', layer: 'tooltip', zIndex: 5000 });

    expect(manager.getZIndex('dropdown')).toBe(100);
    expect(manager.getZIndex('popover')).toBe(210);
    expect(manager.getZIndex('custom')).toBe(5000);
  });

  it('notifies subscribers after stack changes', () => {
    const manager = createOverlayManager();
    let calls = 0;
    const unsubscribe = manager.subscribe(() => {
      calls += 1;
    });

    manager.register({ id: 'first' });
    manager.unregister('first');
    unsubscribe();
    manager.register({ id: 'second' });

    expect(calls).toBe(2);
  });
});
