import { describe, expect, it } from 'vitest';

import { renderNativeStylesTemplate } from './component-native-styles';
import { renderStylesTemplate } from './component-styles';

describe('component style templates', () => {
  it('renders component-token-aware Web styles for boolean form controls', () => {
    const result = renderStylesTemplate({
      componentName: 'Switch',
      profile: 'form-control',
      control: 'boolean',
    });

    expect(result).toContain('var(--switch-off-track-bg)');
    expect(result).toContain('var(--switch-on-default-track-bg)');
    expect(result).toContain('var(--switch-error-border)');
    expect(result).toContain('var(--switch-disabled-track-bg)');
    expect(result).toContain('var(--switch-geometry-track-width)');
    expect(result).toContain('var(--radius-full)');
    expect(result).not.toContain('calc(var(--switch-geometry');
    expect(result).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(result).not.toContain('rgb(');
  });

  it('renders component-token-aware NativeTheme styles for boolean form controls', () => {
    const result = renderNativeStylesTemplate({
      componentName: 'Switch',
      profile: 'form-control',
      control: 'boolean',
    });

    expect(result).toContain("import type { NativeTheme } from '../../theme';");
    expect(result).toContain('theme.components.switch.off.trackBg');
    expect(result).toContain('theme.components.switch.on.default.trackBg');
    expect(result).toContain('theme.components.switch.errorBorder');
    expect(result).toContain('theme.components.switch.disabled.trackBg');
    expect(result).toContain('theme.components.switch.geometry.trackWidth');
    expect(result).toContain('theme.tokens.radius.full');
    expect(result).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });
});
