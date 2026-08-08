import { describe, expect, it } from 'vitest';

import { resolveSelectVirtualization } from './SelectVirtualization';

const options = Array.from({ length: 100 }, (_, index) => ({
  label: `Option ${index}`,
  value: String(index),
}));

describe('resolveSelectVirtualization', () => {
  it('returns the full option set when virtualization is disabled', () => {
    expect(
      resolveSelectVirtualization({
        options,
        scrollTop: 400,
        virtual: false,
      })
    ).toMatchObject({
      bottomSpacerHeight: 0,
      isVirtual: false,
      startIndex: 0,
      topSpacerHeight: 0,
      visibleOptions: options,
    });
  });

  it('returns the full option set while loading', () => {
    expect(
      resolveSelectVirtualization({
        loading: true,
        options,
        scrollTop: 400,
        virtual: true,
      })
    ).toMatchObject({
      bottomSpacerHeight: 0,
      isVirtual: false,
      startIndex: 0,
      topSpacerHeight: 0,
      visibleOptions: options,
    });
  });

  it('calculates visible options and spacer heights from scroll offset', () => {
    const result = resolveSelectVirtualization({
      options,
      scrollTop: 400,
      virtual: { itemHeight: 20 },
    });

    expect(result).toMatchObject({
      bottomSpacerHeight: 1260,
      isVirtual: true,
      itemHeight: 20,
      startIndex: 18,
      topSpacerHeight: 360,
      viewportHeight: 300,
    });
    expect(result.visibleOptions).toHaveLength(19);
    expect(result.visibleOptions[0]?.value).toBe('18');
  });
});
