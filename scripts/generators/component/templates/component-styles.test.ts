import { describe, expect, it } from 'vitest';

import { renderNativeStylesTemplate } from './component-native-styles';
import { renderStylesTemplate } from './component-styles';

describe('component style templates', () => {
  it('renders token-aware Web styles for boolean form controls', () => {
    const result = renderStylesTemplate({
      componentName: 'Switch',
      profile: 'form-control',
      control: 'boolean',
    });

    expect(result).toContain('var(--checkbox-default-bg)');
    expect(result).toContain('var(--checkbox-primary-default-bg)');
    expect(result).toContain('var(--checkbox-error-border)');
    expect(result).toContain('var(--checkbox-disabled-bg)');
    expect(result).toContain('var(--radius-full)');
    expect(result).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(result).not.toContain('rgb(');
  });

  it('renders NativeTheme-aware styles for boolean form controls', () => {
    const result = renderNativeStylesTemplate({
      componentName: 'Switch',
      profile: 'form-control',
      control: 'boolean',
    });

    expect(result).toContain("import type { NativeTheme } from '../../theme';");
    expect(result).toContain('theme.components.checkbox.default.bg');
    expect(result).toContain('theme.components.checkbox.primary.default.bg');
    expect(result).toContain('theme.components.checkbox.error.border');
    expect(result).toContain('theme.components.checkbox.disabled.bg');
    expect(result).toContain('theme.tokens.radius.full');
    expect(result).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });
});
