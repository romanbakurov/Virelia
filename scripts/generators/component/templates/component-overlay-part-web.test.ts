import { describe, expect, it } from 'vitest';

import {
  renderWebOverlayPartComponentTemplate,
  renderWebOverlayPartTypesTemplate,
} from './component-overlay-part-web';

describe('web overlay part templates', () => {
  it('renders overlay Root state types', () => {
    const types = renderWebOverlayPartTypesTemplate({
      componentName: 'Dialog',
      partName: 'Root',
    });

    expect(types).toContain('open?: boolean');
    expect(types).toContain('defaultOpen?: boolean');
    expect(types).toContain('onOpenChange?: (open: boolean) => void');
  });

  it('renders a browser overlay Trigger', () => {
    const trigger = renderWebOverlayPartComponentTemplate({
      componentName: 'Dialog',
      partName: 'Trigger',
    });

    expect(trigger).toContain('export function DialogTrigger');
    expect(trigger).toContain('<button');
    expect(trigger).toContain("aria-haspopup='dialog'");
  });

  it('renders browser overlay Content semantics', () => {
    const content = renderWebOverlayPartComponentTemplate({
      componentName: 'Dialog',
      partName: 'Content',
    });

    expect(content).toContain('export function DialogContent');
    expect(content).toContain("role='dialog'");
    expect(content).toContain('tabIndex={-1}');
  });
});
