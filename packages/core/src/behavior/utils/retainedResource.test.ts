import { describe, expect, it, vi } from 'vitest';

import { createRetainedResourceRegistry } from './retainedResource.js';

describe('createRetainedResourceRegistry', () => {
  it('attaches once per target and detaches after the final release', () => {
    const target = {};
    const detach = vi.fn();
    const attach = vi.fn(() => detach);
    const registry = createRetainedResourceRegistry(attach);

    const releaseFirst = registry.retain(target);
    const releaseSecond = registry.retain(target);

    expect(attach).toHaveBeenCalledTimes(1);

    releaseFirst();

    expect(detach).not.toHaveBeenCalled();

    releaseSecond();

    expect(detach).toHaveBeenCalledTimes(1);
  });

  it('re-attaches after a target has been fully released', () => {
    const target = {};
    const detach = vi.fn();
    const attach = vi.fn(() => detach);
    const registry = createRetainedResourceRegistry(attach);

    registry.retain(target)();
    registry.retain(target)();

    expect(attach).toHaveBeenCalledTimes(2);
    expect(detach).toHaveBeenCalledTimes(2);
  });

  it('returns a noop release when attach is unavailable', () => {
    const target = {};
    const registry = createRetainedResourceRegistry(() => undefined);
    const release = registry.retain(target);

    expect(() => release()).not.toThrow();
  });

  it('clears every retained target', () => {
    const first = {};
    const second = {};
    const detachFirst = vi.fn();
    const detachSecond = vi.fn();
    const registry = createRetainedResourceRegistry((target) =>
      target === first ? detachFirst : detachSecond
    );

    registry.retain(first);
    registry.retain(second);
    registry.clear();

    expect(detachFirst).toHaveBeenCalledTimes(1);
    expect(detachSecond).toHaveBeenCalledTimes(1);
  });
});
