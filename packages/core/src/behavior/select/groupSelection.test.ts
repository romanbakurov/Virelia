import { describe, expect, it } from 'vitest';

import { resolveSelectGroupSelection } from './groupSelection';

describe('resolveSelectGroupSelection', () => {
  it('selects enabled group values without duplicating existing selections', () => {
    expect(
      resolveSelectGroupSelection({
        selectedValues: ['a'],
        groupValues: ['a', 'b', 'c'],
        enabledValues: new Set(['a', 'b', 'c']),
      })
    ).toEqual({
      selectedValues: ['a', 'b', 'c'],
      clearedGroup: false,
      addedValue: 'c',
    });
  });

  it('clears the group when every selectable group value is already selected', () => {
    expect(
      resolveSelectGroupSelection({
        selectedValues: ['a', 'b', 'outside'],
        groupValues: ['a', 'b'],
        enabledValues: new Set(['a', 'b']),
      })
    ).toEqual({
      selectedValues: ['outside'],
      clearedGroup: true,
    });
  });

  it('respects maxSelected while preserving outside selections', () => {
    expect(
      resolveSelectGroupSelection({
        selectedValues: ['outside'],
        groupValues: ['a', 'b', 'c'],
        enabledValues: new Set(['a', 'b', 'c']),
        maxSelected: 3,
      })
    ).toEqual({
      selectedValues: ['outside', 'a', 'b'],
      clearedGroup: false,
      addedValue: 'b',
    });
  });

  it('ignores disabled group values', () => {
    expect(
      resolveSelectGroupSelection({
        selectedValues: [],
        groupValues: ['a', 'b'],
        enabledValues: new Set(['b']),
      })
    ).toEqual({
      selectedValues: ['b'],
      clearedGroup: false,
      addedValue: 'b',
    });
  });
});
