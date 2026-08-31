import { describe, expect, it } from 'vitest';

import { renderIndexTemplate } from './index';

describe('component index template', () => {
  it('renders exports in canonical lint-compatible order', () => {
    expect(
      renderIndexTemplate({
        componentName: 'Accordion',
        parts: ['Root', 'Item', 'Trigger', 'Content'],
      })
    ).toBe(`export * from './Accordion';
export * from './Content';
export * from './Item';
export * from './Root';
export * from './Trigger';
export * from './types';
`);
  });
});
