import { describe, expect, it } from 'vitest';

import { resolveOverlayPresentation } from './presentation.js';

describe('resolveOverlayPresentation', () => {
  it('uses the explicit presentation when provided', () => {
    expect(
      resolveOverlayPresentation({
        presentation: 'modal',
        defaultPresentation: 'inline',
      })
    ).toBe('modal');
  });

  it('uses default presentation when presentation is omitted', () => {
    expect(
      resolveOverlayPresentation({
        defaultPresentation: 'inline',
      })
    ).toBe('inline');
  });

  it('uses auto presentation when presentation is auto', () => {
    expect(
      resolveOverlayPresentation({
        presentation: 'auto',
        defaultPresentation: 'sheet',
        autoPresentation: 'popover',
      })
    ).toBe('popover');
  });
});
