import { describe, expect, it } from 'vitest';

import {
  compoundSlotSymbol,
  copyCompoundSlotMetadata,
  getCompoundSlot,
  markCompoundSlot,
} from './compoundSlot.js';

describe('compound slot metadata', () => {
  it('marks and reads a compound slot', () => {
    const component = () => null;

    const marked = markCompoundSlot(component, 'item');

    expect(marked).toBe(component);
    expect(marked[compoundSlotSymbol]).toBe('item');
    expect(getCompoundSlot(marked)).toBe('item');
  });

  it('reads compound slot metadata from common wrapper shapes', () => {
    const component = markCompoundSlot(() => null, 'content');

    expect(getCompoundSlot({ type: component })).toBe('content');
    expect(getCompoundSlot({ render: component })).toBe('content');
  });

  it('copies metadata to wrapper components without duplicating slot names', () => {
    const source = markCompoundSlot(() => null, 'trigger');
    const target = () => null;

    const copied = copyCompoundSlotMetadata(source, target);

    expect(copied).toBe(target);
    expect(getCompoundSlot(copied)).toBe('trigger');
  });

  it('does not mutate target metadata when source is unmarked', () => {
    const source = () => null;
    const target = markCompoundSlot(() => null, 'item');

    copyCompoundSlotMetadata(source, target);

    expect(getCompoundSlot(target)).toBe('item');
  });
});
