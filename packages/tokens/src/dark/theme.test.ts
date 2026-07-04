import { describe, expect, it } from 'vitest';

import { darkTheme } from './theme';

describe('darkTheme', () => {
  it('exposes theme metadata', () => {
    expect(darkTheme.name).toBe('dark');
  });

  it('exposes theme token groups', () => {
    expect(darkTheme.colors).toBeDefined();
    expect(darkTheme.semantic).toBeDefined();
    expect(darkTheme.components).toBeDefined();
    expect(darkTheme.tokens).toBeDefined();
  });

  it('exposes shared base tokens', () => {
    expect(darkTheme.tokens.spacing).toBeDefined();
    expect(darkTheme.tokens.radius).toBeDefined();
    expect(darkTheme.tokens.shadows).toBeDefined();
    expect(darkTheme.tokens.typography).toBeDefined();
    expect(darkTheme.tokens.zIndex).toBeDefined();
  });

  it('exposes semantic tokens', () => {
    expect(darkTheme.semantic.surface.default).toBeDefined();
    expect(darkTheme.semantic.text.primary).toBeDefined();
    expect(darkTheme.semantic.border.default).toBeDefined();
    expect(darkTheme.semantic.focus.ring).toBeDefined();
    expect(darkTheme.semantic.status.error.fg).toBeDefined();
  });

  it('exposes component tokens', () => {
    expect(darkTheme.components.button.primary.default.bg).toBeDefined();
    expect(darkTheme.components.input.default.bg).toBeDefined();
    expect(darkTheme.components.checkbox.checked.default.bg).toBeDefined();
    expect(darkTheme.components.select.trigger.default.bg).toBeDefined();
    expect(darkTheme.components.tooltip.content.bg).toBeDefined();
  });
});
