import { describe, expect, it } from 'vitest';

import { renderComponentTokenFactoryTemplate } from './templates/component-tokens';

const forbiddenCanonicalRendererVocabulary =
  /\b(?:web|native|reactNative|nativeMaxHeight)\b/;

describe('Generator V2 renderer-neutral component token boundary', () => {
  it.each([
    ['standard', 'value'],
    ['form-control', 'boolean'],
    ['disclosure', 'value'],
  ] as const)(
    'keeps %s/%s canonical token factories renderer-neutral',
    (profile, control) => {
      const source = renderComponentTokenFactoryTemplate({
        componentName: 'Probe',
        profile,
        control,
      });

      expect(source).not.toMatch(forbiddenCanonicalRendererVocabulary);
    }
  );
});
