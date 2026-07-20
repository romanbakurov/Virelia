import { renderToString } from 'react-dom/server';

import { describe, expect, it } from 'vitest';

import { Portal } from './Portal';

describe('Portal', () => {
  it('can render on the server without accessing document', () => {
    expect(() => renderToString(<Portal>content</Portal>)).not.toThrow();
  });
});
