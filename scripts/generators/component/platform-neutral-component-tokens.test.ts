import { describe, expect, it } from 'vitest';

import { renderComponentTokenFactoryTemplate } from './templates/component-tokens';

const forbiddenCanonicalRendererVocabulary =
  /\b(?:web|native|reactNative|nativeMaxHeight)\b/;

describe('Generator V2 renderer-neutral component token boundary', () => {
  it.each([
    [
      'standard',
      { profile: 'base', control: 'value', componentTokens: 'standard' },
    ],
    [
      'boolean-control',
      {
        profile: 'form-control',
        control: 'boolean',
        componentTokens: 'boolean-control',
      },
    ],
    [
      'disclosure',
      { profile: 'base', control: 'value', componentTokens: 'disclosure' },
    ],
  ] as const)(
    'keeps the %s canonical token contract renderer-neutral',
    (_contract, params) => {
      const source = renderComponentTokenFactoryTemplate({
        componentName: 'Probe',
        ...params,
      });

      expect(source).not.toMatch(forbiddenCanonicalRendererVocabulary);
    }
  );
});
