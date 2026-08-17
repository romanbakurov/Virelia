import { describe, expect, it } from 'vitest';

import {
  renderNativeOverlayPartComponentTemplate,
  renderNativeOverlayPartTypesTemplate,
} from './component-overlay-part-native';

describe('native overlay part templates', () => {
  it('renders overlay Root state types', () => {
    const types = renderNativeOverlayPartTypesTemplate({
      componentName: 'Dialog',
      partName: 'Root',
    });

    expect(types).toContain('open?: boolean');
    expect(types).toContain('defaultOpen?: boolean');
    expect(types).toContain('onOpenChange?: (open: boolean) => void');
  });

  it('renders a native overlay Trigger', () => {
    const trigger = renderNativeOverlayPartComponentTemplate({
      componentName: 'Dialog',
      partName: 'Trigger',
    });

    expect(trigger).toContain('export function DialogTrigger');
    expect(trigger).toContain('<Pressable');
    expect(trigger).toContain("accessibilityRole='button'");
  });

  it('renders native overlay Content semantics', () => {
    const content = renderNativeOverlayPartComponentTemplate({
      componentName: 'Dialog',
      partName: 'Content',
    });

    expect(content).toContain('export function DialogContent');
    expect(content).toContain('accessibilityViewIsModal');
    expect(content).not.toContain("role='dialog'");
  });
});
