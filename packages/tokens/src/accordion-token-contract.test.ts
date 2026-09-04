import { describe, expect, it } from 'vitest';

import { darkTheme, highContrastTheme, lightTheme } from './index.js';

describe('Accordion component tokens', () => {
  it('maps component-owned visual roles in every supported theme', () => {
    for (const theme of [lightTheme, darkTheme, highContrastTheme]) {
      const accordion = theme.components.accordion;

      expect(accordion.root.bg).toBe(theme.semantic.surface.default);
      expect(accordion.root.border).toBe(theme.semantic.border.muted);
      expect(accordion.divider).toBe(theme.semantic.border.muted);
      expect(accordion.trigger.default.fg).toBe(theme.semantic.text.primary);
      expect(accordion.trigger.expanded.bg).toBe(theme.semantic.surface.subtle);
      expect(accordion.trigger.hover.bg).toBe(theme.semantic.surface.hover);
      expect(accordion.trigger.pressed.bg).toBe(theme.semantic.surface.pressed);
      expect(accordion.trigger.disabled.fg).toBe(theme.semantic.text.disabled);
      expect(accordion.indicator).toBe(theme.semantic.text.secondary);
      expect(accordion.content.bg).toBe(theme.semantic.surface.subtle);
      expect(accordion.content.fg).toBe(theme.semantic.text.secondary);
      expect(accordion.focusRing).toBe(theme.semantic.focus.ring.color);
    }
  });

  it('resolves theme-specific visual values rather than one shared palette', () => {
    expect(lightTheme.components.accordion.root.bg).not.toBe(
      darkTheme.components.accordion.root.bg
    );
    expect(highContrastTheme.components.accordion.root.bg).not.toBe(
      lightTheme.components.accordion.root.bg
    );
  });
});
