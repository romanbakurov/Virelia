import { describe, expect, it } from 'vitest';

import { highContrastTheme } from '../highContrast/theme';
import { lightTheme } from '../light/theme';

import { darkTheme } from './theme';

describe.each([
  ['light', lightTheme],
  ['dark', darkTheme],
  ['high-contrast', highContrastTheme],
])('%s theme', (themeName, theme) => {
  it('exposes theme metadata', () => {
    expect(theme.name).toBe(themeName);
  });

  it('exposes theme contract', () => {
    expect(theme.colors).toBeDefined();
    expect(theme.semantic).toBeDefined();
    expect(theme.components).toBeDefined();
    expect(theme.tokens).toBeDefined();

    expect(theme.tokens.spacing).toBeDefined();
    expect(theme.tokens.radius).toBeDefined();
    expect(theme.tokens.shadows).toBeDefined();
    expect(theme.tokens.typography).toBeDefined();
    expect(theme.tokens.zIndex).toBeDefined();

    expect(theme.semantic.surface.default).toBeDefined();
    expect(theme.semantic.text.primary).toBeDefined();
    expect(theme.semantic.border.default).toBeDefined();
    expect(theme.semantic.focus.ring).toBeDefined();
    expect(theme.semantic.status.error.fg).toBeDefined();

    expect(theme.components.button.primary.solid.default.bg).toBeDefined();
    expect(theme.components.button.primary.outline.default.bg).toBeDefined();
    expect(theme.components.button.primary.ghost.default.bg).toBeDefined();

    expect(theme.components.input.default.bg).toBeDefined();
    expect(theme.components.checkbox.primary.default.bg).toBeDefined();
    expect(theme.components.checkbox.danger.default.bg).toBe(
      theme.components.button.danger.solid.default.bg
    );
    expect(theme.components.select.trigger.default.bg).toBeDefined();
    expect(theme.components.tooltip.content.bg).toBeDefined();
  });
});

describe('dark theme select', () => {
  it('keeps option hover visible against the dropdown background', () => {
    expect(
      darkTheme.components.select.primary.outline.option.hover.bg
    ).not.toBe(darkTheme.components.select.dropdown.bg);
  });
});
