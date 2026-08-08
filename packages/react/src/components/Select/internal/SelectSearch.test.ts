import { describe, expect, it } from 'vitest';

import { filterSelectOptions } from './SelectSearch';

const options = [
  { label: 'France', value: 'fr', description: 'Paris' },
  { label: 'Germany', value: 'de', description: 49 },
  { label: 'Spain', value: 'es', description: { capital: 'Madrid' } },
];

describe('filterSelectOptions', () => {
  it('returns the original options when search is disabled or empty', () => {
    expect(
      filterSelectOptions({
        options,
        searchable: false,
        searchValue: 'france',
      })
    ).toBe(options);

    expect(
      filterSelectOptions({
        options,
        searchable: true,
        searchValue: '',
      })
    ).toBe(options);
  });

  it('filters by label and primitive description text', () => {
    expect(
      filterSelectOptions({
        options,
        searchable: true,
        searchValue: 'par',
      }).map((option) => option.value)
    ).toEqual(['fr']);

    expect(
      filterSelectOptions({
        options,
        searchable: true,
        searchValue: '49',
      }).map((option) => option.value)
    ).toEqual(['de']);
  });

  it('ignores non-primitive description content', () => {
    expect(
      filterSelectOptions({
        options,
        searchable: true,
        searchValue: 'madrid',
      })
    ).toEqual([]);
  });
});
