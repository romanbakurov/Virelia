import { describe, expect, it } from 'vitest';

import { validateComponentMetadata } from '../validateComponentMetadata';

import {
  buttonMetadata,
  formFieldMetadata,
  modalMetadata,
  selectMetadata,
} from './index';

const componentMetadata = [
  buttonMetadata,
  formFieldMetadata,
  modalMetadata,
  selectMetadata,
] as const;

describe('component metadata fixtures', () => {
  it.each(componentMetadata)('validates $name metadata', (metadata) => {
    const result = validateComponentMetadata(metadata);

    expect(result.valid).toBe(true);

    if (!result.valid) {
      throw new Error(result.errors.join('\n'));
    }
  });
});
