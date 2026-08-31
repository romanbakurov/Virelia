import { describe, expect, it } from 'vitest';

import {
  resolveComponentPageProfile,
  resolveExtractedProps,
} from './resolve-page-input';

import type { ExtractedProp } from './types';

function prop(name: string): ExtractedProp {
  return {
    name,
    kind: 'boolean',
    required: false,
    type: 'boolean | undefined',
    description: '',
    sourceFilePath: `/tmp/${name}/types.ts`,
  };
}

describe('resolveExtractedProps', () => {
  it('prefers shared base props when they exist', () => {
    const sharedProps = [prop('disabled')];

    expect(
      resolveExtractedProps({
        sharedProps,
        reactApiProps: [prop('checked')],
        nativeApiProps: [prop('required')],
      })
    ).toEqual(sharedProps);
  });

  it('falls back to deduplicated platform props for Generator V2 components', () => {
    const checked = prop('checked');
    const disabled = prop('disabled');
    const required = prop('required');

    expect(
      resolveExtractedProps({
        sharedProps: [],
        reactApiProps: [checked, disabled],
        nativeApiProps: [checked, required],
      }).map((item) => item.name)
    ).toEqual(['checked', 'disabled', 'required']);
  });
});

describe('resolveComponentPageProfile', () => {
  it('uses the explicit Generator V2 profile before name inference', () => {
    expect(
      resolveComponentPageProfile({
        componentName: 'Accordion',
        requestedProfile: 'compound',
      })
    ).toBe('compound');
  });

  it('uses canonical Generator V2 metadata before legacy name inference', () => {
    expect(
      resolveComponentPageProfile({
        componentName: 'Accordion',
        generatedProfile: 'compound',
      })
    ).toBe('compound');
  });

  it('preserves curated component page metadata over the requested profile', () => {
    expect(
      resolveComponentPageProfile({
        componentName: 'Accordion',
        metadataProfile: 'navigation',
        requestedProfile: 'compound',
      })
    ).toBe('navigation');
  });
});
